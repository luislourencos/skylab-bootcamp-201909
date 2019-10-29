function OutputRow({row}) {
    
    const { mission_name: mission, links: { mission_patch_small: image }, launch_year: year} = row
    return <li className = "row">
    <a className = "row__link">
        <h2 className = "row__mission">{mission}</h2>
        <h3 className = "row__year">{year}</h3>

        <img className = "row__image" src={image} alt="row"/>

        
        <span className="row__fav">💔</span>
    </a>
</li>
}