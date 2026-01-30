import React from 'react';
import { openContractCall } from '@stacks/connect';
import { StacksTestnet } from '@stacks/network';

export const TransactionSender = () => {
  const handleTransfer = () => {
    openContractCall({
      network: new StacksTestnet(),
      anchorMode: 1,
      contractAddress: 'ST1PQHQKV0RJXZFY1DGX8MNSNYVE3VGZJSRTPGZGM',
      contractName: 'clarity-disc',
      functionName: 'increment',
      functionArgs: [],
      onFinish: (data) => {
        console.log('Finished!', data);
        window.alert('Transaction broadcasted: ' + data.txId);
      },
      onCancel: () => {
        console.log('Canceled!');
      },
    });
  };

  return (
    <div style={{ marginTop: '10px' }}>
        <button onClick={handleTransfer}>
        Increment Counter
        </button>
    </div>
  );
};