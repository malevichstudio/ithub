import {
  Box,
  Card,
  Group,
  TextInput,
  Stack,
  Badge,
  Button,
  Flex,
  Image,
  Divider,
  NumberInput,
  Textarea,
} from '@mantine/core';
import {
  IconUser,
  IconMailFilled,
  IconPhone,
  IconWorldWww,
  IconBuilding,
} from '@tabler/icons-react';
import { useForm, zodResolver } from '@mantine/form';
import { useTranslation } from 'react-i18next';
import { useAppDispatch, useAppSelector } from 'store/hooks';
import { notifications } from '@mantine/notifications';
import { selectUser, selectIsLoading } from '../../userSlice';
import { userEditEmployer } from '../../service';

import type { IEmployerProfileFormValues } from './types';
import { employerProfileSchema } from './schema';
import type { IEmployerAccount } from '../../../types';

export default function EmployerProfile() {
  const { t } = useTranslation();

  const dispatch = useAppDispatch();

  const employer = useAppSelector(selectUser) as IEmployerAccount;

  const isLoading = useAppSelector(selectIsLoading);

  const { getInputProps, onSubmit } = useForm<IEmployerProfileFormValues>({
    initialValues: {
      firstName: employer?.firstName || '',
      lastName: employer?.lastName || '',
      avatar: employer?.avatar || '',
      email: employer?.email || '',
      phone: employer?.phone || '',
      linkedin: employer?.linkedin || '',
      userPosition: employer?.userPosition || '',
      companyName: employer?.companyName || '',
      companyWebSite: employer?.companyWebSite || '',
      companyDouPage: employer?.companyDouPage || '',
      companyLogo: employer?.companyLogo || '',
      companyEmployeesCount: employer?.companyEmployeesCount || 0,
      companyDescription: employer?.companyDescription || '',
    },
    validate: zodResolver(employerProfileSchema),
  });

  const submitHandler = async (values: IEmployerProfileFormValues) => {
    try {
      await dispatch(
        userEditEmployer({ id: employer?._id, ...values }),
      ).unwrap();

      notifications.show({
        color: 'green',
        title: 'Edit user info',
        message: 'User data has updated successful',
      });
    } catch (error: unknown) {
      notifications.show({
        color: 'red',
        title: 'Edit user info',
        message: error as string,
      });
    }
  };

  const updatedDate = new Date(employer?.updatedAt);

  return (
    <Stack gap={24}>
      <Group justify='end'>
        <Badge color='gray'>Last updated: {updatedDate.toUTCString()}</Badge>
      </Group>

      <Card shadow='sm' padding='md' radius='md' withBorder>
        <Box component='form' w='100%' onSubmit={onSubmit(submitHandler)}>
          <Stack gap={12}>
            <Flex gap={24}>
              <Image radius='md' w={200} h={200} src={employer?.avatar} />

              <Stack gap={8} w='100%'>
                <TextInput
                  label='First Name'
                  leftSection={<IconUser size={16} />}
                  {...getInputProps('firstName')}
                />
                <TextInput
                  label='Last Name'
                  leftSection={<IconUser size={16} />}
                  {...getInputProps('lastName')}
                />
                <TextInput
                  leftSection={<IconWorldWww size={16} />}
                  label='Avatar'
                  {...getInputProps('avatar')}
                />
              </Stack>
            </Flex>

            <TextInput
              label='Email'
              leftSection={<IconMailFilled size={16} />}
              readOnly
              {...getInputProps('email')}
            />
            <TextInput
              label='Phone'
              leftSection={<IconPhone size={16} />}
              placeholder='+3780'
              {...getInputProps('phone')}
            />

            <TextInput
              label='LinkedIn page'
              leftSection={<IconWorldWww size={16} />}
              placeholder='https://www.linkedin.com/'
              {...getInputProps('linkedin')}
            />

            <Divider my={12} />

            <Flex gap={24}>
              <Stack gap={8} w='100%'>
                <TextInput
                  label='You position in company'
                  placeholder='HR'
                  leftSection={<IconBuilding size={16} />}
                  {...getInputProps('userPosition')}
                />
                <TextInput
                  label='Company name'
                  leftSection={<IconBuilding size={16} />}
                  {...getInputProps('companyName')}
                />
                <TextInput
                  leftSection={<IconWorldWww size={16} />}
                  label='Company logo'
                  placeholder='https://'
                  {...getInputProps('companyLogo')}
                />
              </Stack>
              <Image radius='md' w={200} h={200} src={employer?.companyLogo} />
            </Flex>

            <TextInput
              leftSection={<IconWorldWww size={16} />}
              label='Company page'
              placeholder='https://'
              {...getInputProps('companyWebSite')}
            />
            <TextInput
              leftSection={<IconWorldWww size={16} />}
              label='Company dou page'
              placeholder='https://jobs.dou.ua/companies/'
              {...getInputProps('companyDouPage')}
            />
            <NumberInput
              label='Employees count'
              hideControls
              allowDecimal={false}
              {...getInputProps('companyEmployeesCount')}
            />

            <Textarea
              label='Company description'
              placeholder='Description..'
              {...getInputProps('companyDescription')}
            />
            <Button type='submit' disabled={isLoading}>
              Update profile
            </Button>
          </Stack>
        </Box>
      </Card>
    </Stack>
  );
}
