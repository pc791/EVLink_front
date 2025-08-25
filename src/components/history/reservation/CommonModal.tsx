import React, { ReactNode } from "react";
import { Modal, Box, Button } from "@mui/material";

interface CommonModalProps {
  open: boolean;
  onClose: () => void;
  children: ReactNode;
}

export default function CommonModal({ open, onClose, children }: CommonModalProps) {
  return (
    <Modal open={open} onClose={onClose}>
      <Box
        sx={{
          position: "absolute",
          top: "50%",
          left: "50%",
          transform: "translate(-50%, -50%)",
          width: 400,
          bgcolor: "background.paper",
          border: "2px solid #000",
          boxShadow: 24,
          p: 4,
        }}
      >
        {children}
        <Button onClick={onClose} sx={{ mt: 2 }}>
          닫기
        </Button>
      </Box>
    </Modal>
  );
}