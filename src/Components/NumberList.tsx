import "../App.css";

type Props = {
  number: number;
  passed?: boolean;
}

function NumberList({ number, passed }: Props) {
  return (
    <div className={passed ? "number passed" : "number"}>{number}</div>
  )
}

export default NumberList