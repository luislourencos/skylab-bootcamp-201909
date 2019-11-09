module.exports = function ({item : { id, title, imageUrl, price, isFav}, favPath}) {
    return `<li class="results__item">
                <a href="#" class="item">
                    <h2 class="item__title">${title}</h2>
                    <img class="item__image" src="${imageUrl}">
                    <span class="item__price">${price}</span>
                    <span class="item__fav">
                    <form method="post" action="${favPath}">
                        <input type="hidden" name="id" value="${id}"
                        <button type="submit">${isFav ? '🧡' : '💔'}</button>
                    </form>
                    </span>
                </a>
            </li>`
}