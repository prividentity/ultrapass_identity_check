import { useState } from "react";
import { deleteUser } from "@privateid/cryptonets-web-sdk-alpha";

// useDelete
const useDelete = (onDeleteEnd: any) => {
  const [loading, setLoading] = useState(false);

  // eslint-disable-next-line react-hooks/exhaustive-deps
  const callback = (result: any) => {
    setLoading(false);
    onDeleteEnd(
      result.returnValue.status === 0 ? "success" : result.returnValue.message
    );
  };

  const onDeleteUser = async (uuid: any) => {
    deleteUser(uuid, callback);
  };

  return { loading, onDeleteUser };
};

export default useDelete;
