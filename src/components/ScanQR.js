import React, { useRef, useState } from "react";
import "./Modals.css";
// import QrReader from "react-qr-reader";
import { Button, Header, Icon, Modal } from "semantic-ui-react";

function ScanQR(props) {
  const qrRef = useRef(null);
  const [scanRes, setScanRes] = useState("");
  const [forward, setforward] = useState(false);

  const handleError = (err) => {
    console.log(err);
  };

  const handleScan = (res) => {
    if (res) {
      setScanRes(res);
      props.handleAddAddress(res);
    }
  };

  const onUploadQR = () => {
    qrRef.current.openImageDialog();
  };

  return (
    <Modal size="tiny" className="modal-des" open={props?.isOpen}>
      <Icon
        name={
          !forward
            ? "arrow alternate circle right outline"
            : "arrow alternate circle left outline"
        }
        size="big"
        style={{ float: "right", marginTop: "30px", marginRight: "20px" }}
        onClick={() => setforward(!forward)}
      />
      <Header
        className="modal-heading"
        icon="qrcode"
        content={!forward ? "Upload QR" : "Scan QR"}
        as="h2"
      />
      {!forward ? (
        <Modal.Content className="modal-content pos-middle-qr">
          <Button
            type="button"
            icon="upload"
            content="Upload QR"
            onClick={onUploadQR}
          />
          <div
            style={{
              width: "200px",
              height: "200px",
              textAlign: "center",
              marginLeft: "auto",
              marginRight: "auto",
              marginTop: "20px",
              marginBottom: "-5px",
            }}
          >
            {/* <QrReader
              ref={qrRef}
              delay={300}
              onError={handleError}
              onScan={handleScan}
              legacyMode
            /> */}
          </div>
          <h3>Uploaded Address: {scanRes}</h3>
        </Modal.Content>
      ) : (
        <Modal.Content className="modal-content pos-middle-qr">
          <div
            style={{
              width: "200px",
              height: "200px",
              textAlign: "center",
              marginLeft: "auto",
              marginRight: "auto",
              marginTop: "20px",
              marginBottom: "-5px",
            }}
          >
            {/* <QrReader delay={300} onError={handleError} onScan={handleScan} /> */}
          </div>
          <h3>Scanned Address: {scanRes}</h3>
        </Modal.Content>
      )}
      <Modal.Actions className="modal-actions">
        <Button
          className="close-button"
          type="button"
          color="red"
          icon="times"
          content="Close"
          onClick={() => props?.closeScanQRModal()}
        />
      </Modal.Actions>
    </Modal>
  );
}

export default ScanQR;