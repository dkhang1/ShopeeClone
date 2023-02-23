import Footer from 'src/components/Footer'
import RegisterHeader from 'src/components/RegisterHeader'

interface Props {
  children?: React.ReactNode
}

export default function RegisterLayout(props: Props) {
  const { children } = props

  return (
    <div>
      <RegisterHeader />
      {children}
      <Footer />
    </div>
  )
}
