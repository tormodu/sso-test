import {
  Card,
  Stack,
  Heading,
  Container,
  Grid,
  Box,
  Text,
  useToast,
  ToastProvider,
  Button,
  Dialog,
  TextInput,
  Checkbox,
  Flex,
} from '@sanity/ui'
import React, {useState, useEffect, useCallback} from 'react'
import {useClient} from 'sanity'

const UserManagerComponent = (props) => {
  const projectId = 'skmdu5gt'
  const client = useClient({apiVersion: '2025-02-06'})
  const toast = useToast()
  const [persons, setPersons] = useState([])
  const [roles, setRoles] = useState([])
  const [email, setEmail] = useState('')
  const [firstName, setFirstName] = useState('')
  const [lastName, setLastName] = useState('')
  const [rolesNewUser, setRolesNewUser] = useState([])
  const [open, setOpen] = useState(false)
  const [openRoles, setOpenRoles] = useState(false)
  const onClose = useCallback(() => setOpen(false), [])
  const onOpen = useCallback(() => setOpen(true), [])
  const onOpenRoles = useCallback(() => setOpenRoles(true), [])
  const onCloseRoles = useCallback(() => setOpenRoles(false), [])

  const addUser = async () => {
    const newUser = {
      role: rolesNewUser.join(','),
      profile: {
        given_name: firstName,
        family_name: lastName,
      },
      organization_code: 'org_32bacd340948',

      identities: [
        {
          type: 'email',
          details: {
            email: email,
          },
        },
      ],
    }

    const res = await fetch(
      'https://sso-saml-example2.vercel.app/addUser?code=09da511e-ffcf-4598-aeaa-4c26b0fcc64f',
      {
        mode: 'no-cors',
        method: 'POST',
        credentials: 'include',
        body: JSON.stringify(newUser),
      },
    )

    toast.push({
      status: 'success',
      title: `Person ${firstName} ${lastName} added`,
    })

    setEmail('')
    setFirstName('')
    setLastName('')
    setRolesNewUser([])
    fetch('https://sso-saml-example2.vercel.app/users?code=09da511e-ffcf-4598-aeaa-4c26b0fcc64f', {
      method: 'GET',
    })
      .then((response) => response.json())
      .then((data) => {
        setPersons(data)
      })
    onClose()
  }
  function setRolesForNewUser(event: any) {
    const {value, checked} = event.target
    if (checked) {
      setRolesNewUser((prev) => [...prev, value])
    } else {
      setRolesNewUser((prev) => prev.filter((role) => role !== value))
    }
  }

  function changeRoles(id: any) {
    let person = persons.find((p) => p.id === id)

    fetch(
      'https://sso-saml-example2.vercel.app/changeRole?code=09da511e-ffcf-4598-aeaa-4c26b0fcc64f',
      {
        method: 'POST',
        mode: 'no-cors',
        body: JSON.stringify({
          id: id,
          roles: person.properties.sanityroles,
        }),
      },
    ).then((response) => {
      toast.push({
        status: 'success',
        title: `Role for person ${person.full_name} updated`,
      })

      onCloseRoles()
    })
  }
  function setRolesForUser(event: any, id: any) {
    let person = persons.find((p) => p.id === id)
    let roles = person.properties.sanityroles.split(',')

    if (event.target.checked) {
      roles.push(event.target.value)
    } else {
      roles = roles.filter((role) => role !== event.target.value)
    }
    person.properties.sanityroles = roles.join(',')
    const updatedPersons = persons.map((person) => (person.id === id ? {...person} : person))
    setPersons(updatedPersons)
  }
  useEffect(() => {
    setRoles([])
    client
      .request({
        uri: `/projects/${projectId}/roles`,

        method: 'GET',
        withCredentials: true,
      })
      .then((res) => {
        setRoles(res)
      })

    setPersons([])
    fetch('https://sso-saml-example2.vercel.app/users?code=09da511e-ffcf-4598-aeaa-4c26b0fcc64f', {
      method: 'GET',
    })
      .then((response) => response.json())
      .then((data) => {
        setPersons(data)
      })
  }, [])
  return (
    <ToastProvider>
      <Container padding={4}>
        <Heading as="h1">User Manager</Heading>
        <Card paddingTop={4} paddingBottom={4}>
          <Button onClick={onOpen} text="Add User" />
        </Card>
        {open && (
          <Dialog header="Add user" id="dialog-example" onClose={onClose} zOffset={1000}>
            <Stack space={1}>
              <Box padding={4}>
                <Card paddingBottom={2}>
                  <Heading size={0}>Email</Heading>
                </Card>
                <TextInput value={email} onChange={(e) => setEmail(e.target.value)}></TextInput>
              </Box>
              <Box padding={4}>
                <Card paddingBottom={2}>
                  <Heading size={0}>First Name</Heading>
                </Card>
                <TextInput
                  value={firstName}
                  onChange={(e) => setFirstName(e.target.value)}
                ></TextInput>
              </Box>
              <Box padding={4}>
                <Card paddingBottom={2}>
                  <Heading size={0}>Last Name</Heading>
                </Card>
                <TextInput
                  value={lastName}
                  onChange={(e) => setLastName(e.target.value)}
                ></TextInput>
              </Box>
              <Box padding={4}>
                <Card paddingBottom={2}>
                  <Heading size={0}>Role</Heading>
                </Card>
                {roles.map((role) => {
                  return (
                    <Card padding={2} key={role.name}>
                      <Flex align="center">
                        <Checkbox
                          id="checkbox"
                          style={{display: 'block'}}
                          value={role.name}
                          onClick={(e) => {
                            setRolesForNewUser(e)
                          }}
                        />
                        <Box flex={1} paddingLeft={3}>
                          <Text>
                            <label htmlFor="checkbox">{role.title}</label>
                          </Text>
                        </Box>
                      </Flex>
                    </Card>
                  )
                })}
              </Box>
              <Box padding={4}>
                <Card paddingBottom={2}>
                  <Button onClick={addUser} text="Save" />
                </Card>
              </Box>
            </Stack>
          </Dialog>
        )}
        <Card>
          <Stack space={4}>
            <Container>
              <Grid columns={[1, 4]} gap={1}>
                <Box flex={1}>
                  <Heading size={1}>Name</Heading>
                </Box>
                <Box flex={1}>
                  <Heading size={1}>Email</Heading>
                </Box>

                <Box flex={1}>
                  <Heading size={1}>Roles</Heading>
                </Box>
              </Grid>
            </Container>
            {persons.map((p) => (
              <Container key={p.id}>
                <Grid columns={[1, 4]} gap={1}>
                  <Box flex={1}>
                    <Text>{p.full_name}</Text>
                  </Box>
                  <Box flex={1}>
                    <Text>{p.email}</Text>
                  </Box>

                  <Box flex={1}>
                    <Text>{p.properties.sanityroles}</Text>

                    {openRoles && (
                      <Dialog
                        header="Change roles"
                        id="dialog-example"
                        onClose={onCloseRoles}
                        zOffset={1000}
                      >
                        {roles.map((role) => {
                          return (
                            <Card padding={2} key={role.name}>
                              <Flex align="center">
                                <Checkbox
                                  id="checkbox"
                                  style={{display: 'block'}}
                                  value={role.name}
                                  checked={p.properties.sanityroles?.includes(role.name)}
                                  onChange={(e) => {
                                    setRolesForUser(e, p.id)
                                  }}
                                />
                                <Box flex={1} paddingLeft={3}>
                                  <Text>
                                    <label htmlFor="checkbox">{role.title}</label>
                                  </Text>
                                </Box>
                              </Flex>
                            </Card>
                          )
                        })}
                        <Box padding={4}>
                          <Card paddingBottom={2}>
                            <Button onClick={(e) => changeRoles(p.id)} text="Save" />
                          </Card>
                        </Box>
                      </Dialog>
                    )}
                  </Box>
                  <Box flex={1}>
                    <Button onClick={onOpenRoles} text="Change roles" />
                  </Box>
                </Grid>
              </Container>
            ))}
          </Stack>
        </Card>
      </Container>
    </ToastProvider>
  )
}

export const UserManager = (config?: any) => ({
  name: 'userManager',
  title: 'User Manager',
  component: UserManagerComponent,
  ...config,
})
