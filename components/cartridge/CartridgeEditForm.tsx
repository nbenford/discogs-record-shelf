import { useState, useCallback, Dispatch, SetStateAction } from 'react';
import { object, string, number } from 'yup';

import { useGetCartridgeList } from '../../hooks/useGetCartridgeList';

//IMPORTED INTERFACES
import {
  CartridgeFormData,
  CartFormErrorAlertInterface,
} from './CartridgeAddForm';

//COMPONENTS
import { ProfileButton } from '../common/Buttons';
import CartridgeDeleteForm from './CartridgeDeleteForm';

//MANTINE
import { TextInput, Alert, Group, NumberInput, Grid } from '@mantine/core';

//INTERFACES
import { CartridgeInterface } from '../../hooks/useGetCartridgeList';

interface PropsInterface {
  setEditCartOpen: Dispatch<SetStateAction<boolean>>;
  cart: CartridgeInterface;
  setIsAPILoading: Dispatch<SetStateAction<boolean>>;
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

const CartridgeEditForm = ({
  setEditCartOpen,
  cart,
  setIsAPILoading,
}: PropsInterface) => {
  const { mutate } = useGetCartridgeList();

  //delete confirm dialog
  const [confirmDeleteOpened, setConfirmDeleteOpened] =
    useState<boolean>(false);

  //form data
  const [formData, setFormData] = useState<CartridgeFormData>({
    id: cart?.id,
    name: cart?.name,
    totalHours: Math.round(cart?.totalMinutes / 60),
    maxHours: cart?.maxHours,
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
          //make sure the current hours is less than total hours
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
              `${process.env.NEXT_PUBLIC_BASE_URL}/api/cartridge/editCart`,
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
              setEditCartOpen(false);
              mutate();
              setFormError(false); //close error box
            }
          } else {
            setFormError(true);
          }
        } else {
          setFormError(true);
          setFormErrorText('Please make sure to include hours.');
          return;
        }
      } catch (err) {
        console.log(err);
      }
    },
    [setIsAPILoading, mutate, setEditCartOpen]
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
            <div style={{ margin: '40px' }} />
            <FormErrorAlert
              formError={formError}
              setFormError={setFormError}
              formErrorText={formErrorText}
            />
          </>
        )}

        <div style={{ margin: '40px' }} />
        {!confirmDeleteOpened && (
          <Group position="center" grow>
            <ProfileButton
              text="Update"
              type="submit"
              callback={() => submitCartridge(formData)}
            />
            <ProfileButton
              text="Cancel"
              callback={() => setEditCartOpen(false)}
            />
          </Group>
        )}
        <div style={{ marginTop: '40px' }} />
        <CartridgeDeleteForm
          setEditCartOpen={setEditCartOpen}
          confirmDeleteOpened={confirmDeleteOpened}
          setConfirmDeleteOpened={setConfirmDeleteOpened}
          cart={cart}
          setIsAPILoading={setIsAPILoading}
        />
        <div style={{ marginTop: '20px' }} />
      </div>
    </>
  );
};

export default CartridgeEditForm;
