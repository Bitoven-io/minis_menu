import CartButton from "../CartButton";

export default function CartButtonExample() {
  return <CartButton itemCount={3} onClick={() => console.log("Cart clicked")} />;
}
