import React, { useEffect, useState } from 'react';
import { Button, Container } from 'react-bootstrap';
import { LinkContainer } from 'react-router-bootstrap';
import { toast } from 'react-toastify';
import { getUsers, giveUserAdminRights as giveUserAdminRightsRequest } from 'api/users';
import { User } from 'types';
import clsx from 'clsx';
import styles from './styles.module.scss';

const Home: React.FC = () => {
  const [users, setUsers] = useState<User[]>();

  useEffect(() => {
    (async () => {
      try {
        setUsers(await getUsers());
      } catch (err) {
        toast.error(err.response?.error || err.message);
      }
    })();
  }, []);

  const giveUserAdminRights = async (user: User) => {
    const answer = window.confirm(`Do you want to give ${user.email} admin access?`);
    if (!answer) return;
    try {
      await giveUserAdminRightsRequest(user.id);
      setUsers(users =>
        users?.map(item => (item.id === user.id ? { ...item, role: 'admin' } : item))
      );
      toast.success(`Success, ${user.email} is now an admin`);
    } catch (err) {
      toast.error(err.response?.error || err.message);
    }
  };

  return (
    <Container fluid="sm" className="d-flex flex-column">
      <h1 className="text-center my-4">Users</h1>
      <div className="border bg-light flex-column p-3 w-100">
        {users?.map(user => (
          <div key={user.id} className={clsx(styles.user, 'border bg-white p-2 my-2')}>
            {user.role !== 'admin' && (
              <Button
                className="float-end"
                variant="outline-danger"
                size="sm"
                onClick={() => giveUserAdminRights(user)}>
                Give admin rights
              </Button>
            )}
            {user.id}
            <div>
              <strong>Email:</strong> <a href={`mailto:${user.email}`}>{user.email}</a>
            </div>
            <div>
              <strong>Role:</strong> {user.role}
            </div>
            <div>
              <strong>Test Reesult:</strong> {user.testResult || '---'}
            </div>
          </div>
        ))}
      </div>
      <LinkContainer to="/">
        <Button className="me-auto my-3" variant="secondary">
          Home
        </Button>
      </LinkContainer>
    </Container>
  );
};

export default Home;
