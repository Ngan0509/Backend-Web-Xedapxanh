import * as APIservice from '../services/APIservice'
const getData = async (req, res) => {
    const resp = await APIservice.getData()

    return res.status(200).json(resp)
}

export { getData }