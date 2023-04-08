/* Shopping wish list app TypeScript */
type WishItem = {
  id?: number,
  title: string,
  description?: string,
  status?: 'done' | 'undone',
};

const removeButtonOnclickEventHandler = (evt: Event) => {
  const e = evt.currentTarget as HTMLElement;
  const wishId = e.parentElement?.getAttribute('data-id');
  const wishList = JSON.parse(localStorage.getItem('wishList')!);
  const index = wishList.findIndex((wish: WishItem) => wish.id!.toString() === wishId);
  wishList.splice(index, 1);
  localStorage.setItem('wishList', JSON.stringify(wishList));
  window.history.pushState(wishList, '', null);
  e!.parentElement!.parentElement!.removeChild(e.parentElement!);
};

function addRemoveButtonToListItem(element: HTMLElement) {
  const removeButton = document.createElement('button');
  const txt = document.createTextNode('Remove');

  removeButton.setAttribute('data-testid', 'btnDeleteCard');
  removeButton.addEventListener('click', removeButtonOnclickEventHandler, false);
  removeButton.className = 'list__item--remove p-2 ml-4'
        + 'mr-2 border-2 float-right bg-rose-900'
        + 'text-rose-50 border-rose-900/20 shadow-rose-900/5'
        + 'rounded hover:text-rose-900 hover:bg-rose-50 max-h-12 self-center';
  removeButton.appendChild(txt);

  element.appendChild(removeButton);
}

const removeRemoveButtonToListItem = (element: HTMLElement) => {
  element.removeChild(element.querySelector('.list__item--remove') as HTMLElement);
};

const getWishListFromLocalStorage = () => JSON.parse(localStorage.getItem('wishList')!);

const setOrAddWishListToLocalStorage = (wish: WishItem) => {
  let newLastId;

  if (!localStorage.getItem('wishList')) {
    localStorage.setItem('wishList', JSON.stringify([wish]));
    window.history.pushState([wish], '', null);
    return wish.id;
  }

  const wishList = getWishListFromLocalStorage();
  if (wishList.length === 0) {
    newLastId = 1;
  } else {
    const lastId = Math.max(...wishList.map((_wish: WishItem) => _wish.id));
    newLastId = lastId + 1;
  }
  wishList.push(Object.assign(wish, { id: newLastId }));
  localStorage.setItem('wishList', JSON.stringify(wishList));
  window.history.pushState(wishList, '', null);
  return newLastId;
};

const updateLocalStorage = (isDone: boolean, wishId: string) => {
  const wishList = getWishListFromLocalStorage();
  const index = wishList.findIndex((wish: WishItem) => wish.id!.toString() === wishId);
  wishList[index].status = isDone ? 'done' : 'undone';
  localStorage.setItem('wishList', JSON.stringify(wishList));
  window.history.pushState(wishList, '', null);
};

const addNewWishItemToList = (wish: WishItem, saveToLocalStorage: boolean = true) => {
  if (wish.title === '') {
    alert('You must write something!');
    return;
  }

  const li = document.createElement('li');
  li.setAttribute('data-testid', 'cardItem');
  li.classList.add(
    'rounded',
    'border',
    'shadow-lg',
    'p-6',
    'mx-10',
    'my-2',
    'w-full',
    'lg:w-3/4',
    'lg:max-w-lg',
    'first-line:font-bold',
  );
  li.innerHTML = `${wish.title}<br>${wish.description}`;

  if (wish.status === 'done') {
    li.classList.toggle('line-through');
    li.classList.toggle('list__item--completed');
    li.classList.add(
      'bg-rose-50',
      'text-rose-900',
      'border-rose-900/20',
      'shadow-rose-900/5',
      'flex',
      'flex-row',
      'justify-between',
    );
    addRemoveButtonToListItem(li);
  } else {
    li.classList.add(
      'bg-sky-50',
      'text-sky-900',
      'border-sky-900/20',
      'shadow-sky-900/5',
    );
  }

  (document.getElementById('list') as HTMLElement).appendChild(li);

  const wishLocalStorageObject: WishItem = {
    id: 1,
    title: wish.title,
    description: wish.description,
    status: 'undone',
  };
  if (saveToLocalStorage && !wish.id) {
    const lastId = setOrAddWishListToLocalStorage(wishLocalStorageObject);
    li.setAttribute('data-id', lastId!.toString());
  } else {
    li.setAttribute('data-id', wish.id!.toString());
  }
};

const buildDOMFromLocalStorage = () => {
  const wishListElement = document.getElementById('list') as HTMLElement;
  wishListElement.innerHTML = '';

  if (!localStorage.getItem('wishList')) {
    return;
  }

  const wishList = getWishListFromLocalStorage();

  const undoneWishes = wishList.filter((wish: WishItem) => wish.status === 'undone');
  if (undoneWishes && undoneWishes.length !== 0) {
    undoneWishes.forEach((wish: WishItem) => addNewWishItemToList(wish, false));
  }

  const doneWishes = wishList.filter((wish: WishItem) => wish.status === 'done');
  if (doneWishes && doneWishes.length !== 0) {
    doneWishes.forEach((wish: WishItem) => addNewWishItemToList(wish, false));
  }
};

const list = document.getElementById('list') as HTMLElement;
list.addEventListener('click', (e: MouseEvent) => {
  const element = e.target as HTMLElement; // element => li
  if (element.tagName !== 'LI') {
    return;
  }

  let isDone;
  if (element.classList.contains('list__item--completed')) {
    removeRemoveButtonToListItem(element!);
    isDone = false;
  } else {
    addRemoveButtonToListItem(element!);
    isDone = true;
  }

  const wishId = element.getAttribute('data-id');
  updateLocalStorage(isDone, wishId!);
  element.classList.toggle('line-through');
  element.classList.toggle('list__item--completed');

  buildDOMFromLocalStorage();
}, false);

const newWishItem = () => {
  const title = (document.getElementById('title') as HTMLInputElement);
  const description = (document.getElementById('description') as HTMLInputElement);
  addNewWishItemToList({ title: title.value, description: description.value });

  title.value = '';
  description.value = '';

  buildDOMFromLocalStorage();
};

const titleInput = document.getElementById('title') as HTMLInputElement;
const descriptionInput = document.getElementById('description') as HTMLInputElement;
titleInput.addEventListener('keypress', event => {
  if (event.key === 'Enter') {
    event.preventDefault();
    (document.getElementById('add') as HTMLElement).click();
  }
});
descriptionInput.addEventListener('keypress', event => {
  if (event.key === 'Enter') {
    event.preventDefault();
    (document.getElementById('add') as HTMLElement).click();
  }
});

const addButton = document.getElementById('add') as HTMLElement;
addButton.addEventListener('click', newWishItem);

window.addEventListener('DOMContentLoaded', () => {
  buildDOMFromLocalStorage();
});
