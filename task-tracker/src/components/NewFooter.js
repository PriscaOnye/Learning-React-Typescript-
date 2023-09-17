import { Link } from 'react-router-dom'

const NewFooter = () => {
  return (
    <footer>
        <p>Copyright &copy; 2021</p>
        <Link to="/about">About</Link>
    </footer>
  )
}

export default NewFooter
