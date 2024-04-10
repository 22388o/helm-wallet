import { useContext } from 'react'
import Button from '../../components/Button'
import ButtonsOnBottom from '../../components/ButtonsOnBottom'
import Title from '../../components/Title'
import { ConfigContext } from '../../providers/config'
import Content from '../../components/Content'
import Container from '../../components/Container'
import { BoltzContext } from '../../providers/boltz'
import { WalletContext } from '../../providers/wallet'
import { prettyNumber } from '../../lib/format'

export default function About() {
  const { maxAllowedAmount } = useContext(BoltzContext)
  const { wallet } = useContext(WalletContext)

  const { toggleShowConfig } = useContext(ConfigContext)
  return (
    <Container>
      <Content>
        <Title text='About' />
        <div className='flex flex-col gap-6 mt-10'>
          <p>
            A lightning wallet that uses liquid (L-BTC) for self-custody and{' '}
            <a className='underline cursor-pointer' href='https://boltz.exchange'>
              Boltz
            </a>{' '}
            swaps to send and receive lightning payments
          </p>
          <p>
            Uses{' '}
            <a className='underline cursor-pointer' href='https://mempool.space'>
              mempool.space
            </a>{' '}
            or{' '}
            <a className='underline cursor-pointer' href='https://blockstream.info'>
              blockstream.info
            </a>{' '}
            to fetch information from the chain
          </p>
          <p className='underline cursor-pointer'>
            <a href='https://github.com/bordalix/thor'>Github</a>
          </p>
          {wallet.initialized ? (
            <p>
              To send all your funds,
              <br />
              create an invoice of <span className='font-semibold'>{prettyNumber(maxAllowedAmount(wallet))}</span> sats
            </p>
          ) : null}
        </div>
      </Content>
      <ButtonsOnBottom>
        <Button onClick={toggleShowConfig} label='Back to wallet' secondary />
      </ButtonsOnBottom>
    </Container>
  )
}
