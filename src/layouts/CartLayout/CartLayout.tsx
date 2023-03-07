import CartHeader from 'src/components/CartHeader'
import Footer from 'src/components/Footer'

interface Props {
  children?: React.ReactNode
}

export default function CartLayout(props: Props) {
  const { children } = props

  return (
    <div>
      <CartHeader />
      {children}
      <Footer />
    </div>
  )
}
