import { useState } from 'react'
import DateRangePicker from '@/components/DateRangePicker'
import IMAGE_BG from '@/assets/images/home_bg.png'
import IconGo from '@/components/Icons/Go'
import PhoneLogin from '../../components/Auth/Phone'
import { isLogin as _isLogin, setToken } from '@/utils/token'
import type { Token } from '@/utils/token'
import { useNavigate, useSearchParams } from 'react-router-dom'
import type { DateRange } from 'react-day-picker'
import { getFormateDate } from '@/utils/date'
import { generateTravelLine } from '@/services/travel'
import { useToast } from '@/components/Toast/use-toast'

function setPersistentLocation(data: { location: string, startTime: string, endTime: string }) {
  localStorage.setItem('location', data.location)
  localStorage.setItem('startTime', data.startTime)
  localStorage.setItem('endTime', data.endTime)
}

function getPersistentLocation() {
  const location = localStorage.getItem('location') || ''
  const startTime = new Date(localStorage.getItem('startTime') || new Date())
  const endTime = new Date(localStorage.getItem('endTime') || new Date())
  return { location, startTime, endTime }
}

type AddressInputProps = {
  value?: string
  onChange: (value: string) => void
  onSearch: () => void
}
function AddressInput(props: AddressInputProps) {
  function onKeyUp(e: React.KeyboardEvent<HTMLInputElement>) {
    if (e.key === 'Enter') {
      props.onSearch()
    }
  }
  return (
    <div className="relative mt-6">
      <input placeholder="去哪里?" value={props.value} onKeyUp={onKeyUp} onChange={e => props.onChange(e.target.value)} className="bg-dark-light-4 text-dark-light border-none outline-none w-[396px] h-[77px] rounded-36 text-36 font-medium box-border px-11 placeholder:text-dark-light" />
      {/* todo icon */}
      <i onClick={props.onSearch} className="absolute w-[62px] cursor-pointer bg-primary flex items-center justify-center h-[62px] rounded-full top-1/2 -translate-y-1/2 right-2.5">
        <IconGo className="w-[52px] text-warn-light" />
      </i>
    </div>
  )
}

function ProfileButton() {
  const navigate = useNavigate()

  return (
    <button onClick={() => navigate('/user/settings')} className="bg-primary-light text-white flex items-center justify-center w-[150px] h-[60px] rounded-30 shadow-button font-medium text-24 outline-none mt-11 hover:bg-primary transition-bg">个人中心</button>
  )
}

export default function Home() {
  const preLocationData = getPersistentLocation()
  const [searchParams] = useSearchParams()
  const [open, setOpen] = useState<boolean>(searchParams.get('login') === 'true')
  const [isLogin, setIsLogin] = useState(_isLogin())
  const [location, setLocation] = useState<string>(preLocationData.location)
  const [range, setRange] = useState<DateRange | undefined>({
    from: preLocationData.startTime,
    to: preLocationData.endTime
  })
  const navigate = useNavigate()
  const { toast, dismiss } = useToast()

  function onSuccess(token: Token) {
    setToken(token)
    setIsLogin(true)
    setOpen(false)
    navigate('/')
  }

  async function onGenerate() {
    const startTime = getFormateDate(range?.from)
    const endTime = getFormateDate(range?.to)
    if (!location) {
      toast({
        title: '请输入旅行地点',
        icon: 'error'
      })
      return
    }
    if (!startTime || !endTime) {
      toast({
        title: '请选择旅行日期',
        icon: 'error'
      })
      return
    }

    setPersistentLocation({ location, startTime, endTime })

    const { id } = toast({
      title: '生成中...',
      icon: 'loading'
    })

    try {
      const { tralineId } = await generateTravelLine({ location, startTime, endTime })
      navigate(`/result/${tralineId}`)
    } catch (e) {
      toast({
        title: '生成失败',
        icon: 'error'
      })
    } finally {
      dismiss(id)
    }
  }

  return (
    <>
      <div style={{ backgroundImage: `url(${IMAGE_BG})` }} className="relative w-screen h-screen bg-cover bg-center flex flex-col justify-center items-center before:flex-1 bg-dark after:absolute after:top-0 after:left-0 after:w-screen after:h-screen after:bg-dark-77">
        <div className="flex-[2] min-h-[640px] flex flex-col flex-shrink-0 items-center justify-center text-white z-10">
          <h1 className="font-semibold text-48">游攻略</h1>
          <p className="font-semibold text-24 mt-5">AI 帮你制作旅行攻略</p>
          <AddressInput value={location} onChange={setLocation} onSearch={onGenerate} />
          <p className="font-semibold text-36 mt-11">旅程日期</p>
          <DateRangePicker value={range} onChange={setRange} className="mt-5" />
          {isLogin && <ProfileButton />}
          {!isLogin && <button onClick={() => setOpen(true)} className="text-18 mt-11 hover:underline cursor-pointer outline-none">现在登录</button>}
        </div>
      </div>
      <PhoneLogin open={open} onOpenChange={setOpen} onSuccess={onSuccess} />
    </>
  )
}
