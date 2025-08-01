#!/usr/bin/env node

import { existsSync, mkdirSync, writeFileSync, readFileSync, readdirSync, statSync } from 'node:fs';
import { join, basename } from 'node:path';
import { execSync } from 'node:child_process';

// Paths
const CONTRACTS_DIR = join(process.cwd(), 'contracts');
const ABIS_DIR = join(process.cwd(), 'abis');

// Create output directory
const outDir = join(ABIS_DIR, 'AAv0.7.0');
if (!existsSync(outDir)) {
  mkdirSync(outDir, { recursive: true });
}

// IEntryPoint ABI (manually created based on the interface)
const entryPointAbi = [
  {
    "inputs": [
      {
        "internalType": "PackedUserOperation",
        "name": "userOp",
        "type": "tuple",
        "components": [
          {"internalType": "address", "name": "sender", "type": "address"},
          {"internalType": "uint256", "name": "nonce", "type": "uint256"},
          {"internalType": "bytes", "name": "initCode", "type": "bytes"},
          {"internalType": "bytes", "name": "callData", "type": "bytes"},
          {"internalType": "bytes32", "name": "accountGasLimits", "type": "bytes32"},
          {"internalType": "uint256", "name": "preVerificationGas", "type": "uint256"},
          {"internalType": "bytes32", "name": "gasFees", "type": "bytes32"},
          {"internalType": "bytes", "name": "paymasterAndData", "type": "bytes"},
          {"internalType": "bytes", "name": "signature", "type": "bytes"}
        ]
      }
    ],
    "name": "getRequiredPrefund",
    "outputs": [
      {
        "internalType": "uint256",
        "name": "requiredPrefund",
        "type": "uint256"
      }
    ],
    "stateMutability": "pure",
    "type": "function"
  },
  {
    "inputs": [
      {
        "internalType": "bytes",
        "name": "initCode",
        "type": "bytes"
      }
    ],
    "name": "getSenderAddress",
    "outputs": [],
    "stateMutability": "nonpayable",
    "type": "function"
  },
  {
    "inputs": [
      {
        "internalType": "address",
        "name": "account",
        "type": "address"
      }
    ],
    "name": "getDepositInfo",
    "outputs": [
      {
        "components": [
          {
            "internalType": "uint112",
            "name": "deposit",
            "type": "uint112"
          },
          {
            "internalType": "bool",
            "name": "staked",
            "type": "bool"
          },
          {
            "internalType": "uint112",
            "name": "stake",
            "type": "uint112"
          },
          {
            "internalType": "uint32",
            "name": "unstakeDelaySec",
            "type": "uint32"
          },
          {
            "internalType": "uint48",
            "name": "withdrawTime",
            "type": "uint48"
          }
        ],
        "internalType": "struct IStakeManager.DepositInfo",
        "name": "",
        "type": "tuple"
      }
    ],
    "stateMutability": "view",
    "type": "function"
  },
  {
    "inputs": [
      {
        "internalType": "address",
        "name": "contract_",
        "type": "address"
      }
    ],
    "name": "getCodeHashOf",
    "outputs": [
      {
        "internalType": "bytes32",
        "name": "codeHash",
        "type": "bytes32"
      }
    ],
    "stateMutability": "view",
    "type": "function"
  },
  {
    "inputs": [
      {
        "components": [
          {
            "internalType": "address",
            "name": "sender",
            "type": "address"
          },
          {
            "internalType": "uint256",
            "name": "nonce",
            "type": "uint256"
          },
          {
            "internalType": "bytes",
            "name": "initCode",
            "type": "bytes"
          },
          {
            "internalType": "bytes",
            "name": "callData",
            "type": "bytes"
          },
          {
            "internalType": "bytes32",
            "name": "accountGasLimits",
            "type": "bytes32"
          },
          {
            "internalType": "uint256",
            "name": "preVerificationGas",
            "type": "uint256"
          },
          {
            "internalType": "bytes32",
            "name": "gasFees",
            "type": "bytes32"
          },
          {
            "internalType": "bytes",
            "name": "paymasterAndData",
            "type": "bytes"
          },
          {
            "internalType": "bytes",
            "name": "signature",
            "type": "bytes"
          }
        ],
        "internalType": "struct PackedUserOperation[]",
        "name": "ops",
        "type": "tuple[]"
      },
      {
        "internalType": "address payable",
        "name": "beneficiary",
        "type": "address"
      }
    ],
    "name": "handleOps",
    "outputs": [],
    "stateMutability": "nonpayable",
    "type": "function"
  },
  {
    "inputs": [
      {
        "components": [
          {
            "internalType": "address",
            "name": "sender",
            "type": "address"
          },
          {
            "internalType": "uint256",
            "name": "nonce",
            "type": "uint256"
          },
          {
            "internalType": "bytes",
            "name": "initCode",
            "type": "bytes"
          },
          {
            "internalType": "bytes",
            "name": "callData",
            "type": "bytes"
          },
          {
            "internalType": "bytes32",
            "name": "accountGasLimits",
            "type": "bytes32"
          },
          {
            "internalType": "uint256",
            "name": "preVerificationGas",
            "type": "uint256"
          },
          {
            "internalType": "bytes32",
            "name": "gasFees",
            "type": "bytes32"
          },
          {
            "internalType": "bytes",
            "name": "paymasterAndData",
            "type": "bytes"
          },
          {
            "internalType": "bytes",
            "name": "signature",
            "type": "bytes"
          }
        ],
        "internalType": "struct PackedUserOperation",
        "name": "op",
        "type": "tuple"
      },
      {
        "internalType": "address payable",
        "name": "beneficiary",
        "type": "address"
      },
      {
        "internalType": "address",
        "name": "target",
        "type": "address"
      },
      {
        "internalType": "bytes",
        "name": "targetCallData",
        "type": "bytes"
      }
    ],
    "name": "handleOp",
    "outputs": [],
    "stateMutability": "nonpayable",
    "type": "function"
  },
  {
    "inputs": [
      {
        "internalType": "address",
        "name": "signatureAggregator",
        "type": "address"
      }
    ],
    "name": "delegateUserOperation",
    "outputs": [],
    "stateMutability": "nonpayable",
    "type": "function"
  },
  {
    "inputs": [
      {
        "components": [
          {
            "internalType": "address",
            "name": "sender",
            "type": "address"
          },
          {
            "internalType": "uint256",
            "name": "nonce",
            "type": "uint256"
          },
          {
            "internalType": "bytes",
            "name": "initCode",
            "type": "bytes"
          },
          {
            "internalType": "bytes",
            "name": "callData",
            "type": "bytes"
          },
          {
            "internalType": "bytes32",
            "name": "accountGasLimits",
            "type": "bytes32"
          },
          {
            "internalType": "uint256",
            "name": "preVerificationGas",
            "type": "uint256"
          },
          {
            "internalType": "bytes32",
            "name": "gasFees",
            "type": "bytes32"
          },
          {
            "internalType": "bytes",
            "name": "paymasterAndData",
            "type": "bytes"
          },
          {
            "internalType": "bytes",
            "name": "signature",
            "type": "bytes"
          }
        ],
        "internalType": "struct PackedUserOperation",
        "name": "userOp",
        "type": "tuple"
      }
    ],
    "name": "getUserOpHash",
    "outputs": [
      {
        "internalType": "bytes32",
        "name": "userOpHash",
        "type": "bytes32"
      }
    ],
    "stateMutability": "view",
    "type": "function"
  },
  {
    "inputs": [
      {
        "components": [
          {
            "internalType": "address",
            "name": "sender",
            "type": "address"
          },
          {
            "internalType": "uint256",
            "name": "nonce",
            "type": "uint256"
          },
          {
            "internalType": "bytes",
            "name": "initCode",
            "type": "bytes"
          },
          {
            "internalType": "bytes",
            "name": "callData",
            "type": "bytes"
          },
          {
            "internalType": "bytes32",
            "name": "accountGasLimits",
            "type": "bytes32"
          },
          {
            "internalType": "uint256",
            "name": "preVerificationGas",
            "type": "uint256"
          },
          {
            "internalType": "bytes32",
            "name": "gasFees",
            "type": "bytes32"
          },
          {
            "internalType": "bytes",
            "name": "paymasterAndData",
            "type": "bytes"
          },
          {
            "internalType": "bytes",
            "name": "signature",
            "type": "bytes"
          }
        ],
        "internalType": "struct PackedUserOperation",
        "name": "userOp",
        "type": "tuple"
      }
    ],
    "name": "simulateValidation",
    "outputs": [],
    "stateMutability": "nonpayable",
    "type": "function"
  },
  {
    "inputs": [
      {
        "components": [
          {
            "internalType": "address",
            "name": "sender",
            "type": "address"
          },
          {
            "internalType": "uint256",
            "name": "nonce",
            "type": "uint256"
          },
          {
            "internalType": "bytes",
            "name": "initCode",
            "type": "bytes"
          },
          {
            "internalType": "bytes",
            "name": "callData",
            "type": "bytes"
          },
          {
            "internalType": "bytes32",
            "name": "accountGasLimits",
            "type": "bytes32"
          },
          {
            "internalType": "uint256",
            "name": "preVerificationGas",
            "type": "uint256"
          },
          {
            "internalType": "bytes32",
            "name": "gasFees",
            "type": "bytes32"
          },
          {
            "internalType": "bytes",
            "name": "paymasterAndData",
            "type": "bytes"
          },
          {
            "internalType": "bytes",
            "name": "signature",
            "type": "bytes"
          }
        ],
        "internalType": "struct PackedUserOperation",
        "name": "op",
        "type": "tuple"
      },
      {
        "internalType": "address",
        "name": "target",
        "type": "address"
      },
      {
        "internalType": "bytes",
        "name": "targetCallData",
        "type": "bytes"
      }
    ],
    "name": "simulateHandleOp",
    "outputs": [],
    "stateMutability": "nonpayable",
    "type": "function"
  }
];

// IEntryPointSimulations ABI (manually created based on the interface)
const entryPointSimulationsAbi = [
  ...entryPointAbi,
  {
    "inputs": [
      {
        "components": [
          {
            "internalType": "address",
            "name": "sender",
            "type": "address"
          },
          {
            "internalType": "uint256",
            "name": "nonce",
            "type": "uint256"
          },
          {
            "internalType": "bytes",
            "name": "initCode",
            "type": "bytes"
          },
          {
            "internalType": "bytes",
            "name": "callData",
            "type": "bytes"
          },
          {
            "internalType": "bytes32",
            "name": "accountGasLimits",
            "type": "bytes32"
          },
          {
            "internalType": "uint256",
            "name": "preVerificationGas",
            "type": "uint256"
          },
          {
            "internalType": "bytes32",
            "name": "gasFees",
            "type": "bytes32"
          },
          {
            "internalType": "bytes",
            "name": "paymasterAndData",
            "type": "bytes"
          },
          {
            "internalType": "bytes",
            "name": "signature",
            "type": "bytes"
          }
        ],
        "internalType": "struct PackedUserOperation",
        "name": "userOp",
        "type": "tuple"
      }
    ],
    "name": "simulateValidation",
    "outputs": [
      {
        "internalType": "uint256",
        "name": "preOpGas",
        "type": "uint256"
      },
      {
        "internalType": "uint256",
        "name": "prefund",
        "type": "uint256"
      },
      {
        "internalType": "address",
        "name": "actualAggregator",
        "type": "address"
      },
      {
        "internalType": "bytes",
        "name": "paymasterContext",
        "type": "bytes"
      }
    ],
    "stateMutability": "nonpayable",
    "type": "function"
  },
  {
    "inputs": [
      {
        "components": [
          {
            "internalType": "address",
            "name": "sender",
            "type": "address"
          },
          {
            "internalType": "uint256",
            "name": "nonce",
            "type": "uint256"
          },
          {
            "internalType": "bytes",
            "name": "initCode",
            "type": "bytes"
          },
          {
            "internalType": "bytes",
            "name": "callData",
            "type": "bytes"
          },
          {
            "internalType": "bytes32",
            "name": "accountGasLimits",
            "type": "bytes32"
          },
          {
            "internalType": "uint256",
            "name": "preVerificationGas",
            "type": "uint256"
          },
          {
            "internalType": "bytes32",
            "name": "gasFees",
            "type": "bytes32"
          },
          {
            "internalType": "bytes",
            "name": "paymasterAndData",
            "type": "bytes"
          },
          {
            "internalType": "bytes",
            "name": "signature",
            "type": "bytes"
          }
        ],
        "internalType": "struct PackedUserOperation",
        "name": "op",
        "type": "tuple"
      },
      {
        "internalType": "address",
        "name": "target",
        "type": "address"
      },
      {
        "internalType": "bytes",
        "name": "targetCallData",
        "type": "bytes"
      }
    ],
    "name": "simulateHandleOp",
    "outputs": [
      {
        "components": [
          {
            "internalType": "uint256",
            "name": "preOpGas",
            "type": "uint256"
          },
          {
            "internalType": "uint256",
            "name": "paid",
            "type": "uint256"
          },
          {
            "internalType": "uint256",
            "name": "accountValidationData",
            "type": "uint256"
          },
          {
            "internalType": "uint256",
            "name": "paymasterValidationData",
            "type": "uint256"
          },
          {
            "internalType": "bool",
            "name": "targetSuccess",
            "type": "bool"
          },
          {
            "internalType": "bytes",
            "name": "targetResult",
            "type": "bytes"
          }
        ],
        "internalType": "struct IEntryPointSimulations.ExecutionResult",
        "name": "executionResult",
        "type": "tuple"
      }
    ],
    "stateMutability": "nonpayable",
    "type": "function"
  }
];

// Write the ABIs to files
writeFileSync(join(outDir, 'IEntryPoint.json'), JSON.stringify(entryPointAbi, null, 2));
writeFileSync(join(outDir, 'IEntryPointSimulations.json'), JSON.stringify(entryPointSimulationsAbi, null, 2));

console.log('Manually created ABIs for IEntryPoint and IEntryPointSimulations');

// Count all files recursively in a directory
function countFilesRecursively(dir, extension) {
  let count = 0;
  const items = readdirSync(dir);
  
  for (const item of items) {
    const fullPath = join(dir, item);
    const stats = statSync(fullPath);
    
    if (stats.isDirectory()) {
      count += countFilesRecursively(fullPath, extension);
    } else if (item.endsWith(extension)) {
      count++;
    }
  }
  
  return count;
}

// Validate the number of generated ABIs against the number of contract files
if (process.argv.includes('--validate')) {
  const contractCount = countFilesRecursively(CONTRACTS_DIR, '.sol');
  const abiCount = countFilesRecursively(ABIS_DIR, '.json');
  
  console.log(`\nValidation Check:`);
  console.log(`  - Total contract files: ${contractCount}`);
  console.log(`  - Total generated ABIs: ${abiCount}`);
  
  if (abiCount === contractCount) {
    console.log('\n✅ OK: The number of generated ABIs matches the number of contract files.');
  } else {
    console.log('\n❌ NOK: The number of generated ABIs does not match the number of contract files.');
  }
} 