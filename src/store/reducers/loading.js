const loadingState = {
  initialLoadComplete: false,
};

export default (state = loadingState, action) => {
  switch (action.type) {
    case 'INITIAL_LOAD_COMPLETE':
      let newState = Object.assign(state, { initialLoadComplete: true });
      return newState;
    default:
      return state;
  }
};
