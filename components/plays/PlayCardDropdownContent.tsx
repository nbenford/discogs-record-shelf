import { memo } from 'react';
import dayjs from 'dayjs';

//COMPONENTS
import SkeletonLoader from '../common/SkeletonLoader';

//MANTINE
import { Accordion, Text, Table, ScrollArea, Rating } from '@mantine/core';
import { poppins } from '../common/fonts';

//HOOK
import useGetAlbumInfo from '../../hooks/useGetAlbumInfo';

//INTERFACE
import { AlbumInfoPropsInterface } from '../../hooks/useGetAlbumInfo';

const PlayDropdownContent = ({
  id,
  masterId,
}: {
  id: number;
  masterId: number;
}) => {
  const { data, error, isLoading, isValidating }: AlbumInfoPropsInterface =
    useGetAlbumInfo(id, masterId);

  const albumInfo = data?.albumInfo;

  //tracklist
  const tracklistRows = albumInfo?.tracklist?.map((track) => (
    <tr key={track.title}>
      <th>
        <Text truncate fw={700} style={poppins.style}>
          {track.position}
        </Text>
      </th>
      <th style={{ maxWidth: '200px' }}>
        <Text truncate fw={400} style={poppins.style}>
          {track.title}
        </Text>
      </th>
      {track.duration && (
        <th>
          <Text truncate fw={400} style={poppins.style}>
            {track.duration}
          </Text>
        </th>
      )}
    </tr>
  ));

  if (error) return <div>Error</div>;
  if (isLoading || isValidating) return <SkeletonLoader />;
  if (albumInfo === undefined)
    return (
      <div style={{ padding: '2rem' }}>
        <Text fw={400}>No information available</Text>
      </div>
    );

  return (
    <>
      <Accordion.Panel>
        <div>
          <Text span fw={600} color="indigo.5" style={poppins.style}>
            {albumInfo?.label}
          </Text>
          {albumInfo?.label && albumInfo?.catalogNo && (
            <Text span> &mdash; </Text>
          )}
          <Text span fs="italic" style={poppins.style}>
            {albumInfo?.catalogNo}
          </Text>
          <div />
          {albumInfo?.released && (
            <Text span style={poppins.style}>
              Released {dayjs(albumInfo?.released).format('YYYY')}
            </Text>
          )}
          {albumInfo?.released && albumInfo?.country && <Text span>, </Text>}
          <Text span style={poppins.style}>
            {albumInfo?.country}
          </Text>
          <div style={{ marginTop: '0.2rem' }} />
          {albumInfo?.rating && (
            <Rating value={albumInfo?.rating} fractions={2} readOnly />
          )}
          <div style={{ marginTop: '1.5rem' }} />
          <Text fw={700} span size={'1.1rem'} color="red.5">
            {albumInfo?.genres?.length > 1 ? 'Genres' : 'Genre'}:
          </Text>{' '}
          {albumInfo?.genres?.map((genre, index) => {
            return (
              <span key={index}>
                <Text span style={poppins.style}>
                  {genre}
                </Text>
                {albumInfo?.genres?.length > 1 &&
                  index < albumInfo.genres?.length - 1 && <Text span>, </Text>}
              </span>
            );
          })}
          <div />
          <Text fw={700} span size={'1.1rem'} color="red.5">
            {albumInfo?.styles?.length > 1 ? 'Styles' : 'Style'}:
          </Text>{' '}
          {albumInfo?.styles?.map((style, index) => (
            <span key={index}>
              <Text span style={poppins.style}>
                {style}
              </Text>
              {albumInfo?.styles?.length > 1 &&
                index < albumInfo.styles?.length - 1 && <Text span>, </Text>}
            </span>
          ))}
          <div style={{ marginTop: '1.5rem' }} />
          <div>
            {albumInfo?.tracklist && (
              <ScrollArea>
                <Table>
                  <thead>
                    <tr>
                      <th style={{ width: '20px' }}></th>
                      <th>
                        <Text style={poppins.style}>Title</Text>
                      </th>
                      {albumInfo?.tracklist[0]?.duration && (
                        <th style={{ minWidth: '70px' }}>
                          <Text style={poppins.style}>Length</Text>
                        </th>
                      )}
                    </tr>
                  </thead>
                  <tbody>{tracklistRows}</tbody>
                </Table>
              </ScrollArea>
            )}
          </div>
        </div>
      </Accordion.Panel>
    </>
  );
};

export const PlayCardDropdownContent = memo(PlayDropdownContent);
