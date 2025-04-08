import "../App.css";

type Props = {
  number: number;
  passed?: boolean;
}

function NumberList({ number, passed }: Props) {
  let className = "number";
  if (passed) className += " question-number";
  return (
    <div className={className}>{number}</div>
  )
}

export default NumberList