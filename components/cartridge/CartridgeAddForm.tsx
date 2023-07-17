import { useState, useCallback } from 'react';
import { Dispatch, SetStateAction } from 'react';
import { object, string, number } from 'yup';

import { useGetCartridgeList } from '../../hooks/useGetCartridgeList';

//COMPONENTS
import { ProfileButton } from '../common/Buttons';

//MANTINE
import { TextInput, Alert, Group, NumberInput, Grid } from '@mantine/core';

interface FormInterface {
  name: string;
  totalHours: number | undefined;
  maxHours: number | undefined;
}

interface PropsInterface {
  setAddCartOpen: Dispatch<SetStateAction<boolean>>;
  setIsAPILoading: Dispatch<SetStateAction<boolean>>;
}

export interface CartridgeFormData {
  id?: number;
  name: string;
  maxHours: number | undefined;
  totalHours: number | undefined;
}

export interface CartFormErrorAlertInterface {
  formError: boolean;
  setFormError: (e: boolean) => void;
  formErrorText: string;
}

let cartridgeSchema = object({
  name: string().trim().required(),
  maxHours: number().required().positive().integer().nonNullable(),
  totalHours: number().required().positive().integer().nonNullable(),
});

const FormErrorAlert = ({
  formError,
  setFormError,
  formErrorText,
}: CartFormErrorAlertInterface) => (
  <Alert
    withCloseButton
    onClose={() => setFormError(!formError)}
    closeButtonLabel="Close alert"
    title="Error"
    color="red"
  >
    {formErrorText}
  </Alert>
);

const CartridgeAddForm = ({
  setAddCartOpen,
  setIsAPILoading,
}: PropsInterface) => {
  const { mutate } = useGetCartridgeList();

  //form data
  const [formData, setFormData] = useState<FormInterface>({
    name: '',
    totalHours: undefined,
    maxHours: undefined,
  });

  //if form is not correct
  const [formError, setFormError] = useState<boolean>(false);
  const [formErrorText, setFormErrorText] = useState<string>(
    'Please make sure all fields are filled out correctly.'
  );

  const submitCartridge = useCallback(
    async (formData: CartridgeFormData) => {
      try {
        if (
          formData.maxHours !== undefined &&
          formData.totalHours !== undefined
        ) {
          if (formData.maxHours < formData.totalHours) {
            setFormError(true);
            setFormErrorText(
              'Current stylus hours must be less that maximum hours.'
            );
            return;
          }

          //using Yup to check validity of the form
          const isformValid = await cartridgeSchema.isValid(formData, {
            abortEarly: false, // Prevent aborting validation after first error
          });
          if (isformValid) {
            setIsAPILoading(true);
            const res = await fetch(
              `${process.env.NEXT_PUBLIC_BASE_URL}/api/cartridge/addCart`,
              {
                method: 'POST',
                body: JSON.stringify({
                  formData: {
                    ...formData,
                    totalMinutes: formData.totalHours * 60,
                  },
                }),
              }
            );
            const data = await res.json();
            setIsAPILoading(false);
            //if we get data back from the API, we know the add was a success
            if (data) {
              mutate();
              setFormError(false); //close error box
              setAddCartOpen(false); //close add cart form
            }
          } else {
            setFormError(true);
          }
        } else {
          setFormError(true);
          setFormErrorText('Please make sure to include hours.');
          return;
        }
        //make sure the current hours is less than total hours
      } catch (err) {
        console.log(err);
      }
    },
    [setAddCartOpen, setIsAPILoading, mutate]
  );

  return (
    <>
      <div style={{ width: '100%' }}>
        <Grid>
          <Grid.Col xs={12}>
            <TextInput
              aria-label="Cartridge Name"
              label="Cartridge Name"
              description="Enter memorable name for your cartridge"
              placeholder="e.g. Denon DL-110"
              value={formData.name}
              onChange={(event) =>
                setFormData({ ...formData, name: event.currentTarget.value })
              }
            />
          </Grid.Col>
          {/* <div style={{ margin: '20px' }} /> */}
          <Grid.Col xs={12} xl={6}>
            <NumberInput
              aria-label="Total Current Stylus Hours"
              label="Total Current Stylus Hours"
              description="The estimated number of current hours on the stylus"
              placeholder="e.g. 0"
              value={formData.totalHours}
              onChange={(num: number) =>
                setFormData({
                  ...formData,
                  totalHours: num,
                })
              }
            />
          </Grid.Col>
          {/* <div style={{ margin: '20px' }} /> */}
          <Grid.Col xs={12} xl={6}>
            <NumberInput
              aria-label="Maximum Stylus Hours"
              label="Maximum Stylus Hours"
              description="The number of hours at which the stylus must be replaced"
              placeholder="e.g. 1000"
              value={formData.maxHours}
              onChange={(num: number) =>
                setFormData({
                  ...formData,
                  maxHours: num,
                })
              }
            />
          </Grid.Col>
        </Grid>
        {formError && (
          <>
            <div style={{ marginTop: '40px' }} />
            <FormErrorAlert
              formError={formError}
              setFormError={setFormError}
              formErrorText={formErrorText}
            />
          </>
        )}
        <div style={{ marginTop: '40px' }} />
        <Group position="center" grow>
          <ProfileButton
            text="Submit"
            type="submit"
            callback={() => submitCartridge(formData)}
          />
          <ProfileButton text="Cancel" callback={() => setAddCartOpen(false)} />
        </Group>
        <div style={{ marginBottom: '20px' }} />
      </div>
    </>
  );
};

export default CartridgeAddForm;
