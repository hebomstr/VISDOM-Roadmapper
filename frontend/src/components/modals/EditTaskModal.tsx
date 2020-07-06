import React, { useEffect, useState } from 'react';
import { Alert, Form } from 'react-bootstrap';
import { Trans, useTranslation } from 'react-i18next';
import { shallowEqual, useDispatch, useSelector } from 'react-redux';
import { StoreDispatchType } from '../../redux';
import { roadmapsActions } from '../../redux/roadmaps/index';
import { Task, TaskRequest } from '../../redux/roadmaps/types';
import { RootState } from '../../redux/types';
import { userActions } from '../../redux/user';
import { userInfoSelector } from '../../redux/user/selectors';
import { UserInfo } from '../../redux/user/types';
import { StyledButton } from '../forms/StyledButton';
import { StyledFormControl } from '../forms/StyledFormControl';
import { ModalCloseButton } from './modalparts/ModalCloseButton';
import { ModalContent } from './modalparts/ModalContent';
import { ModalFooter } from './modalparts/ModalFooter';
import { ModalFooterButtonDiv } from './modalparts/ModalFooterButtonDiv';
import { ModalHeader } from './modalparts/ModalHeader';
import { ModalProps } from '../types';

export interface EditTaskModalProps extends ModalProps {
  task: Task;
}

export const EditTaskModal: React.FC<EditTaskModalProps> = ({
  closeModal,
  task,
}) => {
  const { t } = useTranslation();
  const dispatch = useDispatch<StoreDispatchType>();
  const [formValues, setFormValues] = useState({
    name: task.name,
    description: task.description,
  });
  const [hasError, setHasError] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');
  const userInfo = useSelector<RootState, UserInfo | undefined>(
    userInfoSelector,
    shallowEqual,
  );

  useEffect(() => {
    if (!userInfo) dispatch(userActions.getUserInfo());
  }, [userInfo, dispatch]);

  const handleSubmit = (event: React.FormEvent<HTMLFormElement>) => {
    const form = event.currentTarget;
    event.preventDefault();
    event.stopPropagation();

    if (form.checkValidity()) {
      const req: TaskRequest = {
        id: task.id,
        name: formValues.name,
        description: formValues.description,
        createdByUser: userInfo?.id,
      };

      dispatch(roadmapsActions.patchTask(req)).then((res) => {
        if (roadmapsActions.patchTask.rejected.match(res)) {
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

  const onNameChange = (name: string) => {
    setFormValues({ ...formValues, name });
  };

  const onDescriptionChange = (description: string) => {
    setFormValues({ ...formValues, description });
  };

  return (
    <>
      <ModalCloseButton onClick={closeModal} />

      <Form onSubmit={handleSubmit}>
        <ModalHeader>
          <Trans i18nKey="Edit task" />
        </ModalHeader>

        <ModalContent>
          <Form.Group>
            <StyledFormControl
              autoComplete="off"
              required
              name="name"
              id="name"
              placeholder={t('Task name')}
              value={formValues.name}
              onChange={(e: any) => onNameChange(e.currentTarget.value)}
            />
          </Form.Group>

          <Form.Group>
            <StyledFormControl
              isTextArea
              required
              as="textarea"
              name="description"
              id="description"
              placeholder={t('Description')}
              value={formValues.description}
              onChange={(e: any) => onDescriptionChange(e.currentTarget.value)}
            />
          </Form.Group>
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
            <StyledButton fullWidth buttonType="cancel" onClick={closeModal}>
              <Trans i18nKey="Cancel" />
            </StyledButton>
          </ModalFooterButtonDiv>
          <ModalFooterButtonDiv>
            <StyledButton fullWidth buttonType="submit" type="submit">
              <Trans i18nKey="Save" />
            </StyledButton>
          </ModalFooterButtonDiv>
        </ModalFooter>
      </Form>
    </>
  );
};