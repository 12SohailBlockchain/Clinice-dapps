import Logo from "assets/svgs/logo";
import CustomButton from "components/CustomButton";
import { EMR_ABI, EMR_CONTRACT_ADDRESS } from "contract/abi_file_contract";
import React, { useCallback, useEffect, useState } from "react";
import { useNavigate } from "react-router";
import Web3 from "web3";
import { ethers } from "ethers";

function Home() {
  const [emr, setemr] = useState("");
  const [addressForGrant, setAddressForGrant] = useState("");
  const [addressForRevoke, setAddressForRevoke] = useState("");

  const [loading, setloading] = useState(false);
  const [grantloading, setGrantloading] = useState(false);
  const [revokeLoading, setRevokeLoading] = useState(false);

  const [emrContractInfo, setEemrContractInfo] = useState(null);
  const navigate = useNavigate();

  const handleChange = useCallback((e) => {
    let value = e?.target?.value;
    setemr(value);
  }, []);

  const grantAccess = useCallback(async () => {
    if (addressForGrant) {
      setGrantloading(true);
      const access = await emrContractInfo.methods
        .grantAccess(addressForGrant)
        .call();
      setGrantloading(false);
    } else {
      alert("Please address first");
    }
  }, [addressForGrant, emrContractInfo]);

  const revokeAccess = useCallback(async () => {
    if (addressForRevoke) {
      setRevokeLoading(true);
      const access = await emrContractInfo.methods
        .revokeAccess(addressForRevoke)
        .call();
      setRevokeLoading(false);
    } else {
      alert("Please address first");
    }
  }, [addressForRevoke, emrContractInfo]);

  const viewEMRRecord = useCallback(async () => {
    try {
      const viewResult = await emrContractInfo?.methods.viewEMR().call();
      setemr(viewResult);
      setloading(false);
    } catch (error) {
      setloading(false);
      console.log("error", error);
    }
  }, [emrContractInfo]);

  useEffect(() => {
    try {
      if (localStorage.getItem("account")) {
        const newWeb3 = new Web3((window as any)?.ethereum);
        const emrContract = new newWeb3.eth.Contract(
          EMR_ABI,
          EMR_CONTRACT_ADDRESS
        );
        setEemrContractInfo(emrContract);
        viewEMRRecord();
      } else {
        navigate("/");
      }
    } catch (error) {
      console.log(error, "erro");
    }
  }, [navigate]);

  const submit = useCallback(() => {
    if (!emr) {
      alert("Please Enter EMR");
    }
    setloading(true);
    emrContractInfo?.methods
      .addRecord(emr)
      .send({ from: localStorage.getItem("account") })
      .on("error", function (error) {
        setloading(false);
      })
      .on("transactionHash", function (transactionHash) {
        setloading(false);
      })
      .on("receipt", function (receipt) {
        console.log(receipt.contractAddress); // contains the new contract address
      })
      .on("confirmation", function (confirmationNumber, receipt) {
        setloading(false);
      })
      .then(function (newContractInstance) {
        console.log(newContractInstance.options.address); // instance with the new contract address
      });
  }, [emr, emrContractInfo]);

  return (
    <div className="root">
      <div className="d-flex flex-column justify-content-center align-items-center w-100 b-container">
        <div className="d-flex  cardBox">
          <div className="d-flex w-100 justify-content-center align-items-center">
            <Logo />
          </div>
          <input
            placeholder="Enter Electronic Medical Record"
            className="inputField"
            type={"text"}
            name="emr"
            onChange={handleChange}
          />
          <CustomButton
            variant="primary"
            onClick={submit}
            type="submit"
            text={"Add Record To BlockChain"}
            loading={loading ? true : false}
          />

          <input
            placeholder="Enter Wallet Adress to grant access"
            className="inputField"
            type={"text"}
            name="adress_grant"
            onChange={(e) => setAddressForGrant(e?.target?.value)}
          />
          <CustomButton
            variant="primary"
            onClick={grantAccess}
            type="submit"
            text={"Grant Access"}
            loading={grantloading ? true : false}
          />
          <input
            placeholder="Enter Wallet Adress to revoke access"
            className="inputField"
            type={"text"}
            name="revoke_acess"
            onChange={(e) => setAddressForRevoke(e?.target?.value)}
          />
          <CustomButton
            variant="primary"
            onClick={revokeAccess}
            type="submit"
            text={"Revoke Access"}
            loading={revokeLoading ? true : false}
          />
        </div>
      </div>
    </div>
  );
}

export default Home;
