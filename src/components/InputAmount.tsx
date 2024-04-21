import { useEffect, useState } from 'react'
import Columns from './Columns'
import Label from './Label'
import { fromSatoshis, prettyNumber, toSatoshis } from '../lib/format'

enum UnitLabel {
  BTC = 'BTC',
  Sats = 'Sats',
}

interface InputAmountProps {
  label: string
  onChange: (arg0: any) => void
}

export default function InputAmount({ label, onChange }: InputAmountProps) {
  const [amount, setAmount] = useState('0')
  const [sats, setSats] = useState(true)

  const keys = ['1', '2', '3', '4', '5', '6', '7', '8', '9', '.', '0', '<']

  useEffect(() => {
    setSats(!/\./.test(amount))
    onChange(!/\./.test(amount) ? Number(amount) : toSatoshis(parseFloat(amount)))
  }, [amount])

  const unit = sats ? UnitLabel.Sats : UnitLabel.BTC
  const className =
    'w-full p-3 pr-6 text-sm text-right font-semibold rounded-l-md -mr-4 bg-gray-100 dark:bg-gray-800 focus-visible:outline-none'
  const isMobile = 'ontouchstart' in window || navigator.maxTouchPoints // TODO

  const clickHandler = (key: string) => {
    if (amount === '0' && key === '.') return setAmount('0.')
    if (amount === '0' && key !== '<') return setAmount(key)
    if (key === '<') {
      const aux = amount.split('')
      return setAmount(aux.slice(0, aux.length - 1).join(''))
    }
    setAmount(amount + key)
  }

  const alternativeAmount = () => {
    if (!amount || isNaN(Number(amount))) return sats ? '0 BTC' : '0 sats'
    return sats
      ? prettyNumber(fromSatoshis(parseInt(amount))) + ' BTC'
      : prettyNumber(toSatoshis(parseFloat(amount))) + ' sats'
  }

  return (
    <fieldset className='text-left text-gray-800 dark:text-gray-100 w-full'>
      {label ? <Label text={label} /> : null}
      <div className='flex items-center h-12 rounded-l-md bg-gray-100 dark:bg-gray-800'>
        {isMobile ? (
          <p className={className}>{amount}</p>
        ) : (
          <input type='text' placeholder='0' onChange={(e) => setAmount(e.target.value)} className={className} />
        )}
        <div className='w-16 h-full flex items-center rounded-r-md text-sm bg-gray-400 text-gray-100 dark:text-gray-800'>
          <div className='mx-auto font-semibold'>{unit}</div>
        </div>
      </div>
      <p className='text-right text-xs mb-2 sm:mb-4 sm:mt-2'>{alternativeAmount()}</p>
      {isMobile ? (
        <Columns cols={3}>
          {keys.map((k) => (
            <p
              key={k}
              className='text-center p-3 sm:p-5 bg-gray-100 dark:bg-gray-800 select-none'
              onClick={() => clickHandler(k)}
            >
              {k}
            </p>
          ))}
        </Columns>
      ) : null}
    </fieldset>
  )
}
