
import React, { useState } from "react";
import { Text } from "react-native";
import { Modal, Portal, Provider as PaperProvider } from "react-native-paper";

export default function TaskActionsModal() {
  const [modalOpen, setModalOpen] = useState(false);
  return (
        <PaperProvider>
          <Portal>
            <Modal
              visible={modalOpen}
              onDismiss={() => setModalOpen(false)}
              contentContainerStyle={{ backgroundColor: "white", padding: 80 }}
            >
              <Text>Example Modal. Click outside this area to dismiss.</Text>
            </Modal>
          </Portal>
        </PaperProvider>
  );
}
