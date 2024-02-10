import { Config } from '../providers/config'
import { NetworkName } from './network'

export enum ExplorerName {
  Blockstream = 'Blockstream',
  Mempool = 'Mempool',
  Nigiri = 'Nigiri',
}

export interface ExplorerURLs {
  webExplorerURL: string
  websocketExplorerURL: string // ws:// or wss:// endpoint
}

export interface Explorer {
  name: ExplorerName
  [NetworkName.Liquid]?: ExplorerURLs
  [NetworkName.Testnet]?: ExplorerURLs
  [NetworkName.Regtest]?: ExplorerURLs
}

const explorers: Explorer[] = [
  {
    name: ExplorerName.Blockstream,
    [NetworkName.Liquid]: {
      webExplorerURL: 'https://blockstream.info/liquid',
      websocketExplorerURL: 'wss://blockstream.info/liquid/electrum-websocket/api',
    },
    [NetworkName.Testnet]: {
      webExplorerURL: 'https://blockstream.info/liquidtestnet',
      websocketExplorerURL: 'wss://blockstream.info/liquidtestnet/electrum-websocket/api',
    },
  },
  {
    name: ExplorerName.Mempool,
    [NetworkName.Liquid]: {
      webExplorerURL: 'https://liquid.network',
      websocketExplorerURL: 'wss://esplora.blockstream.com/liquid/electrum-websocket/api',
    },
    [NetworkName.Testnet]: {
      webExplorerURL: 'https://liquid.network/liquidtestnet',
      websocketExplorerURL: 'wss://esplora.blockstream.com/liquidtestnet/electrum-websocket/api',
    },
  },
  {
    name: ExplorerName.Nigiri,
    [NetworkName.Regtest]: {
      webExplorerURL: 'http://localhost:5001',
      websocketExplorerURL: 'ws://127.0.0.1:1234',
    },
  },
]

export const getExplorerNames = ({ network }: Config) => explorers.filter((e: any) => e[network]).map((e) => e.name)

export const getExplorerURL = ({ network, explorer }: Config) => {
  const exp = explorers.find((e) => e.name === explorer)
  if (exp && exp[network]) return exp[network]?.webExplorerURL
}

export interface AddressInfo {
  address: string
  chain_stats: {
    funded_txo_count: number
    spent_txo_count: number
    tx_count: number
  }
  mempool_stats: {
    funded_txo_count: number
    spent_txo_count: number
    tx_count: number
  }
}

export const fetchAddress = async (config: Config, address: string): Promise<AddressInfo> => {
  const explorerURL = getExplorerURL(config)
  const url = `${explorerURL}/api/address/${address}`
  const response = await fetch(url)
  return await response.json()
}

export interface UtxoInfo {
  txid: string
  vout: number
  status: {
    confirmed: boolean
    block_height: number
    block_hash: string
    block_time: number
  }
  asset: string
  value: number
  valuecommitment: string
  assetcommitment: string
  noncecommitment: string
}

export const fetchUtxos = async (config: Config, address: string): Promise<UtxoInfo[]> => {
  const data = await fetchAddress(config, address)
  if (!data?.chain_stats?.tx_count) return []
  const explorerURL = getExplorerURL(config)
  const response = await fetch(`${explorerURL}/api/address/${address}/utxo`)
  return await response.json()
}