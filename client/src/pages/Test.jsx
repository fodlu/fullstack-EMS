import { LoaderPinwheel, SquareBottomDashedScissors } from "lucide-react";
import { useState } from "react";

const Test = () => {
    const [loading, setLoading] = useState(false)
    const handleSubmit = (e) => {
        e.preventDefault();
        const formData = new FormData(e.currentTarget);
        const data = Object.fromEntries(formData.entries())
        setLoading(true)
        setTimeout(() => {
            console.log(data)
            console.log(formData.get('country'))
            e.target.reset()
            setLoading(false)
        }, 2000);
    }

    const [search, setSearch] = useState('')
    const names = ["Ade", "Bambi", "Olabode", 'Opeyemi', "Kayode", 'Otenep', 'James'];
    const filtered = names.filter(n=> n.toLowerCase().includes(search.toLowerCase()))

    return (
    <div>
        <form onSubmit={handleSubmit}>
            <input type="text" name="full name" placeholder="Insert full name" />
            <input type="text" name="country" placeholder="Insert country" />
            <input type="text" name="state" placeholder="Insert state" />
            <select name="select">
                <option value="man">man</option>
                <option value="woman">woman</option>
                <option value="Gay">Gay</option>
            </select>
            <button disabled={loading} className="btn-primary flex items-center gap-3" type="submit">
                {!loading ? (<><SquareBottomDashedScissors className="w-4 h-4" /> <p>Submit</p></>) : <LoaderPinwheel className="w-5 h-5 animate-spin" />}
            </button>
        </form>

        <div className="">
            <input className="my-3" type="text" value={search} onChange={e=> setSearch(e.target.value)} />
            {filtered.map((name) => <button className="btn-primary px-2 py-3 mr-2" key={name}>{name}</button>)}
        </div>
    </div>
  )
}

export default Test