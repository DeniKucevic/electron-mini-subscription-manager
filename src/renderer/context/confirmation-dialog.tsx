import React from 'react';
import { BclModal } from 'renderer/components/bcl-modal';

type ConfirmationDialogProps = {
  open: boolean;
  title: string;
  message: string;
  onConfirm: () => void;
  onDismiss: () => void;
};

const ConfirmationDialog: React.FC<ConfirmationDialogProps> = ({
  open,
  title,
  message,
  onConfirm,
  onDismiss,
}) => {
  return (
    <BclModal isShowing={open} hide={onDismiss}>
      <div style={{ textAlign: 'center' }}>
        <h3>{title}</h3>
        <p>{message}</p>
        <div className="toolbar-actions">
          <button type="button" className="btn btn-default" onClick={onDismiss}>
            Cancel
          </button>

          <button type="button" className="btn btn-primary" onClick={onConfirm}>
            OK
          </button>
        </div>
      </div>
    </BclModal>
  );
};

const ConfirmationDialogContext = React.createContext<any>({});

const ConfirmationDialogProvider: React.FC = ({ children }) => {
  const [dialogOpen, setDialogOpen] = React.useState(false);
  const [dialogConfig, setDialogConfig] = React.useState<any>({});

  type DialogProps = {
    title: string;
    message: string;
    actionCallback: () => void;
  };

  const openDialog = ({ title, message, actionCallback }: DialogProps) => {
    setDialogOpen(true);
    setDialogConfig({ title, message, actionCallback });
  };

  const resetDialog = () => {
    setDialogOpen(false);
    setDialogConfig({});
  };

  const onConfirm = () => {
    resetDialog();
    dialogConfig.actionCallback(true);
  };

  const onDismiss = () => {
    resetDialog();
    dialogConfig.actionCallback(false);
  };

  return (
    <ConfirmationDialogContext.Provider value={{ openDialog }}>
      <ConfirmationDialog
        open={dialogOpen}
        title={dialogConfig?.title}
        message={dialogConfig?.message}
        onConfirm={onConfirm}
        onDismiss={onDismiss}
      />
      {children}
    </ConfirmationDialogContext.Provider>
  );
};

const useConfirmationDialog = () => {
  const { openDialog } = React.useContext(ConfirmationDialogContext);

  const getConfirmation = ({ ...options }) =>
    new Promise((resolve) => {
      openDialog({ actionCallback: resolve, ...options });
    });

  return { getConfirmation };
};

export default ConfirmationDialog;
export { ConfirmationDialogProvider, useConfirmationDialog };
