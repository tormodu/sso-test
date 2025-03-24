import {
  Card,
  Stack,
  Heading,
  Container,
  Grid,
  Box,
  Text,
  Select,
  useToast,
  ToastProvider,
  Button,
  Dialog,
  TextInput,
} from '@sanity/ui'
import React, {useState, useEffect, useCallback} from 'react'

const UserManagerComponent = (props) => {
  const toast = useToast()
  const [persons, setPersons] = useState([])
  const [email, setEmail] = useState('')
  const [firstName, setFirstName] = useState('')
  const [lastName, setLastName] = useState('')
  const [selectedRole, setSelectedRole] = useState('sanity_read')

  const [open, setOpen] = useState(false)
  const onClose = useCallback(() => setOpen(false), [])
  const onOpen = useCallback(() => setOpen(true), [])
  const roles = [
    {name: 'Read', value: 'sanity_read', id: '01958aba-09d6-8623-dd41-b2a88d17b391'},
    {name: 'Write', value: 'sanity_write', id: '01958b89-5248-b6fd-f28f-daa5d5411eca'},
  ]

  const addUser = async () => {
    const newUser = {
      role: roles.find((r) => r.value === (selectedRole === '' ? 'sanity_read' : selectedRole))?.id,
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
      //'http://localhost:3000/addUser?code=09da511e-ffcf-4598-aeaa-4c26b0fcc64f',
      {
        mode: 'no-cors',
        method: 'POST',
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
    setSelectedRole('')

    onClose()
  }

  function changeRole(id, newValue) {
    const person = persons.find((p) => p.id === id)

    fetch(`https://api.sanity.io/v2021-06-07/projects/skmdu5gt/acl/${id}`, {
      method: 'PUT',
      body: JSON.stringify({
        roleName: newValue,
      }),
      headers: {
        'Content-Type': 'application/json',
        Authorization:
          'Bearer skXGgbZKh6V6u3MuOQ8WBWRv3E30Gbr9zkDoQLz0QUBY3ZGnfWslGgymfUURMi78ML30JEMjaXqj0ZWB5CmETGRlgRUwJJJZEGPNn725O9EOM8L745VRpF23knramEMxZFBIF2koUDqaYzqSv5r56kZD6VzAdFDexXtRtTpqz4cCWr1DIlAI',
      },
    })

    fetch(`https://api.sanity.io/v2021-06-07/projects/skmdu5gt/acl/${id}`, {
      method: 'DELETE',
      body: JSON.stringify({
        roleName: person.role,
      }),
      headers: {
        'Content-Type': 'application/json',
        Authorization:
          'Bearer skXGgbZKh6V6u3MuOQ8WBWRv3E30Gbr9zkDoQLz0QUBY3ZGnfWslGgymfUURMi78ML30JEMjaXqj0ZWB5CmETGRlgRUwJJJZEGPNn725O9EOM8L745VRpF23knramEMxZFBIF2koUDqaYzqSv5r56kZD6VzAdFDexXtRtTpqz4cCWr1DIlAI',
      },
    })
    const updatedPersons = persons.map((person) =>
      person.id === id ? {...person, role: newValue} : person,
    )

    toast.push({
      status: 'success',
      title: `Role for person ${decodeURIComponent(escape(person.displayName))} updated`,
    })
    setPersons(updatedPersons)
  }
  useEffect(() => {
    setPersons([])
    fetch('https://api.sanity.io/v2021-06-07/projects/skmdu5gt/acl', {
      method: 'GET',
      mode: 'no-cors',
      headers: {
        Authorization:
          'Bearer skXGgbZKh6V6u3MuOQ8WBWRv3E30Gbr9zkDoQLz0QUBY3ZGnfWslGgymfUURMi78ML30JEMjaXqj0ZWB5CmETGRlgRUwJJJZEGPNn725O9EOM8L745VRpF23knramEMxZFBIF2koUDqaYzqSv5r56kZD6VzAdFDexXtRtTpqz4cCWr1DIlAI',
      },
    })
      .then((response) => response.json())
      .then((data) => {
        const filteredUsers = data.filter(
          (p) =>
            p.roles.filter((r) => r.name === 'sanity_read' || r.name === 'sanity_write').length > 0,
        )

        for (const user of filteredUsers) {
          fetch(`https://api.sanity.io/v2021-06-07/projects/skmdu5gt/users/${user.projectUserId}`, {
            method: 'GET',
            headers: {
              Authorization:
                'Bearer skXGgbZKh6V6u3MuOQ8WBWRv3E30Gbr9zkDoQLz0QUBY3ZGnfWslGgymfUURMi78ML30JEMjaXqj0ZWB5CmETGRlgRUwJJJZEGPNn725O9EOM8L745VRpF23knramEMxZFBIF2koUDqaYzqSv5r56kZD6VzAdFDexXtRtTpqz4cCWr1DIlAI',
            },
          })
            .then((response) => response.json())
            .then((data) => {
              data.role = user.roles[0].name
              setPersons((prevPersons) => [...prevPersons, data])
            })
        }
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
                <Select value={selectedRole} onChange={(e) => setSelectedRole(e.target.value)}>
                  {roles.map((role) => {
                    return (
                      <option value={role.value} key={role.value}>
                        {role.name}
                      </option>
                    )
                  })}
                </Select>
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
                  <Heading size={1}>Login provider</Heading>
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
                    <Text>{decodeURIComponent(escape(p.displayName))}</Text>
                  </Box>
                  <Box flex={1}>
                    <Text>{p.email}</Text>
                  </Box>
                  <Box flex={1}>
                    <Text>{p.loginProvider}</Text>
                  </Box>
                  <Box flex={1}>
                    <Select
                      value={p.role}
                      onChange={(e) => changeRole(p.id, e.target.value)}
                      key={`select${p.id}`}
                    >
                      {roles.map((role) => {
                        return (
                          <option value={role.value} key={role.value}>
                            {role.name}
                          </option>
                        )
                      })}
                    </Select>
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
