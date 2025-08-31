import client, { download } from "./ApiClient";

export const getTimeline = (params) => {
  return client("timeline", { params });
};

export const getTimelineV2 = (params) => {
  return client("v2/timeline", { params });
};

export const getDetailTimeline = (id, params) => {
  return client(`timeline/${id}`, { params });
};

export const postTimeline = (payload) => {
  return client("timeline", {
    method: "POST",
    body: payload,
  });
};

export const downloadTimelineAbsen = (payload) => {
  return download("timeline/download-absen", {
    method: "POST",
    body: payload,
  });
};

export const editTimeline = (id, payload) => {
  return client(`timeline/${id}`, {
    method: "PUT",
    body: payload,
  });
};

export const deleteTimeline = (id) => {
  return client(`timeline/${id}`, {
    method: "DELETE",
  });
};

export const postTkTimelineKomen = (body) => {
  return client("tk-timeline-komen", {
    method: "POST",
    body,
  });
};

export const postTimelineKomen = (body) => {
  return client("timeline-komen", {
    method: "POST",
    body,
  });
};

export const deleteTimelineKomen = (id) => {
  return client(`timeline-komen/${id}`, {
    method: "DELETE",
  });
};
