import {
  Box,
  Card,
  TextInput,
  Stack,
  Button,
  Checkbox,
  Group,
  Text,
} from '@mantine/core';
import { useForm, zodResolver } from '@mantine/form';
import { useAppSelector, useAppDispatch } from 'store/hooks';
import { notifications } from '@mantine/notifications';
import { selectIsLoading, selectResume } from '../../resumeSlice';
import { editResume } from '../../services';

import type { IResumeFormValues } from './types';
import { resumeSchema } from './schema';

export default function Resume() {
  const dispatch = useAppDispatch();

  const {
    // eslint-disable-next-line @typescript-eslint/naming-convention
    _id,
    position,
    category,
    workExperience,
    salaryExpectations,
    country,
    city,
    relocation,
    englishLevel,
    summary,
    employmentOptions,
    updatedAt,
  } = useAppSelector(selectResume);
  const isLoading = useAppSelector(selectIsLoading);

  const { getInputProps, onSubmit } = useForm<IResumeFormValues>({
    initialValues: {
      position,
      category,
      workExperience,
      salaryExpectations,
      country,
      city,
      relocation,
      englishLevel,
      summary,
      employmentOptions,
    },
    validate: zodResolver(resumeSchema),
  });

  const submitHandler = async (values: IResumeFormValues) => {
    try {
      await dispatch(editResume({ id: _id, ...values })).unwrap();
      notifications.show({
        color: 'green',
        title: 'Edit resume',
        message: 'The resume was successfully updated',
      });
    } catch (error: unknown) {
      notifications.show({
        color: 'red',
        title: 'Edit resume',
        message: error as string,
      });
    }
  };

  const updatedDate = new Date(updatedAt);

  return (
    <Stack gap={24}>
      <Text>Last Updated: {updatedDate.toUTCString()}</Text>

      <Card shadow='sm' padding='md' radius='md' withBorder>
        <Box component='form' w='100%' onSubmit={onSubmit(submitHandler)}>
          <Stack gap={12}>
            <TextInput label='Position' {...getInputProps('position')} />
            <TextInput label='Category' {...getInputProps('category')} />
            <TextInput
              label='Work experience'
              {...getInputProps('workExperience')}
            />
            <TextInput
              label='Salary expectations'
              {...getInputProps('salaryExpectations')}
            />

            <TextInput
              label='Country of residence'
              {...getInputProps('country')}
            />

            <TextInput label='City' {...getInputProps('city')} />

            <Checkbox
              label='Relocation'
              {...getInputProps('relocation', { type: 'checkbox' })}
            />

            <TextInput
              label='English level'
              {...getInputProps('englishLevel')}
            />

            <TextInput label='Summary' {...getInputProps('summary')} />
            <TextInput
              label='Employment options'
              {...getInputProps('employmentOptions')}
            />

            <Button type='submit' disabled={isLoading}>
              Update resume
            </Button>
          </Stack>
        </Box>
      </Card>
    </Stack>
  );
}
