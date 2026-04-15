class ApiResponse {
  static send(res, statusCode, message, data = null, meta = undefined) {
    const payload = {
      success: statusCode < 400,
      message,
    };

    if (data !== null) {
      payload.data = data;
    }

    if (meta !== undefined) {
      payload.meta = meta;
    }

    return res.status(statusCode).json(payload);
  }

  static ok(res, message = "Success", data = null, meta = undefined) {
    return ApiResponse.send(res, 200, message, data, meta);
  }

  static created(res, message = "Created successfully", data = null) {
    return ApiResponse.send(res, 201, message, data);
  }

  static noContent(res) {
    return res.status(204).send();
  }
}

export default ApiResponse;
