import Button from "react-bootstrap/Button";
import Modal from "react-bootstrap/Modal";

function ModalCentered (props: any) {

  return (
    <Modal
      {...props}
      size="xl"
      aria-labelledby="contained-modal-title-vcenter"
      centered
    >
      <Modal.Header>
        <p>Heading</p>
      </Modal.Header>
      <Modal.Body>
        <h4>Centered Modal</h4>
        <p>
          {props.data.description}
        </p>
      </Modal.Body>
      <Modal.Footer>
        <Button onClick={props.onHide}>Close</Button>
      </Modal.Footer>
    </Modal>
  );
};

export default ModalCentered;
