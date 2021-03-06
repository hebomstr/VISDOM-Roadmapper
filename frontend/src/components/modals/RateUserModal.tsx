/* eslint-disable jsx-a11y/label-has-associated-control */
import React, { useEffect, useState } from 'react';
import { Alert, Form } from 'react-bootstrap';
import { Trans } from 'react-i18next';
import { useDispatch, useSelector } from 'react-redux';
import { StoreDispatchType } from '../../redux';
import { roadmapsActions } from '../../redux/roadmaps/index';
import { userSelector } from '../../redux/roadmaps/selectors';
import { PublicUserRequest } from '../../redux/roadmaps/types';
import { StyledButton } from '../forms/StyledButton';
import { StyledFormControl } from '../forms/StyledFormControl';
import { LoadingSpinner } from '../LoadingSpinner';
import { ModalProps } from '../types';
import { ModalCloseButton } from './modalparts/ModalCloseButton';
import { ModalContent } from './modalparts/ModalContent';
import { ModalFooter } from './modalparts/ModalFooter';
import { ModalFooterButtonDiv } from './modalparts/ModalFooterButtonDiv';
import { ModalHeader } from './modalparts/ModalHeader';

export interface RateUserModalProps extends ModalProps {
  userId: number;
}

export const RateUserModal: React.FC<RateUserModalProps> = ({
  closeModal,
  userId,
}) => {
  const user = useSelector(userSelector(userId))!;
  const dispatch = useDispatch<StoreDispatchType>();
  const [hasError, setHasError] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');
  const [userValue, setUserValue] = useState(user?.customerValue || 0);

  useEffect(() => {
    if (user) setUserValue(user?.customerValue || 0);
  }, [user]);

  if (!user) return null;
  const handleSubmit = (event: React.FormEvent<HTMLFormElement>) => {
    const form = event.currentTarget;
    event.preventDefault();
    event.stopPropagation();

    if (form.checkValidity()) {
      const req: PublicUserRequest = {
        id: user.id,
        customerValue: userValue,
      };

      setIsLoading(true);
      dispatch(roadmapsActions.patchPublicUser(req)).then((res) => {
        setIsLoading(false);
        if (roadmapsActions.patchPublicUser.rejected.match(res)) {
          setHasError(true);
          if (res.payload) {
            setErrorMessage(res.payload.message);
          }
        } else {
          closeModal();
        }
      });
    }
  };

  const onValueChange = (value: number) => {
    setUserValue(value);
  };

  return (
    <>
      <ModalCloseButton onClick={closeModal} />

      <Form onSubmit={handleSubmit}>
        <ModalHeader>
          <Trans i18nKey="Rate customer" />
        </ModalHeader>

        <ModalContent>
          <label htmlFor="name">
            <Trans i18nKey="Value" /> (€)
          </label>
          <StyledFormControl
            autoComplete="off"
            required
            type="number"
            min="0"
            name="name"
            id="name"
            value={userValue}
            onChange={(e: any) => onValueChange(+e.currentTarget.value)}
          />
          <Alert
            show={hasError}
            variant="danger"
            dismissible
            onClose={() => setHasError(false)}
          >
            {errorMessage}
          </Alert>
        </ModalContent>
        <ModalFooter>
          <ModalFooterButtonDiv rightmargin>
            <StyledButton
              fullWidth
              buttonType="cancel"
              onClick={closeModal}
              type="button"
            >
              <Trans i18nKey="Cancel" />
            </StyledButton>
          </ModalFooterButtonDiv>
          <ModalFooterButtonDiv>
            {isLoading ? (
              <LoadingSpinner />
            ) : (
              <StyledButton fullWidth buttonType="submit" type="submit">
                <Trans i18nKey="Save" />
              </StyledButton>
            )}
          </ModalFooterButtonDiv>
        </ModalFooter>
      </Form>
    </>
  );
};
