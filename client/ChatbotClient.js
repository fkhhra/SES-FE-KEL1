import client from "./ApiClient";

export const openAIResponse = (payload) => {
  return client('chatbot', {
    method: 'POST',
    body: payload
  })
}

export const postInvalidIntent = (payload) => {
  return client('invalid-intent', {
    method: 'POST',
    body: payload
  })
}

export const getChatrooms = () => {
  return client('chatrooms')
}

export const deleteAllChatrooms = () => {
  return client(`chatrooms`, {
    method: 'DELETE'
  })
}

export const deleteChatroomById = (id) => {
  return client(`chatrooms/${id}`, {
    method: 'DELETE'
  })
}

export const getMessagesByChatroomId = (chatroom_id) => {
  return client(`messages/${chatroom_id}`)
}

export const getSuggetions = (inputValue) => {
  return client('suggestions', {
    method: 'POST',
    body: {
      input_value: inputValue
    }
  })
}