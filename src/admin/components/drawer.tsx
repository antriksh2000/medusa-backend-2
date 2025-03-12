import { Button, FocusModal } from "@medusajs/ui";

type DrawerComponentProps = {
  title: string;
  content: any;
};

export default function DrawerComponent({ content }: DrawerComponentProps) {
  return (
    <FocusModal>
      <FocusModal.Trigger asChild>
        <Button>Edit Variant</Button>
      </FocusModal.Trigger>
      <FocusModal.Content>
        <FocusModal.Header>
          <Button>Save</Button>
        </FocusModal.Header>
        <FocusModal.Body className="flex overflow-y-scroll flex-col py-16">
          <div className="flex w-full flex-col gap-y-8">
            <div>{content}</div>
          </div>
        </FocusModal.Body>
      </FocusModal.Content>
    </FocusModal>
  );
}
