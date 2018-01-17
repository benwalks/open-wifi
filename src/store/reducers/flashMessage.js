// HEALTH MESSAGE STATE
const healthMsg = {
  showFlash: true,
  currentMessage: null,
  messages: [
    {
      heading: 'The diabetes story',
      content: 'https://diabetesstory.info/',
      icon: 'md-checkmark-circle',
    },
    {
      heading: 'Indigenous health information and more',
      content: 'www.hitnet.com.au/kiosk/',
      icon: 'md-checkmark-circle',
    },
  ],
};

export default (state = healthMsg, action) => {
  switch (action.type) {
    case 'SELECT_HEALTH_MESSAGE':
      const currentMessage = randomHealthMessage(state.messages);
      return Object.assign({}, state, { currentMessage });
    case 'RESTORE_FLASH':
      return Object.assign({}, state, { showFlash: true });
    case 'REMOVE_FLASH':
      return Object.assign({}, state, { showFlash: false });
    default:
      return state;
  }
};

const randomHealthMessage = messages => {
  for (var i = messages.length - 1; i > 0; i--) {
    var j = (Math.floor(Math.random() * (i + 1))[(messages[i], messages[j])] = [
      messages[j],
      messages[i],
    ]);
  }

  return messages[Math.floor(Math.random() * messages.length)];
};
