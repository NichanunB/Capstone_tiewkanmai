package com.tiewkanmai.dto.request;

public class RecommendRequest {
private int user_id;
private int top_n;

public RecommendRequest() {
}

public RecommendRequest(int user_id, int top_n) {
    this.user_id = user_id;
    this.top_n = top_n;
}

public int getUser_id() {
    return user_id;
}

public void setUser_id(int user_id) {
    this.user_id = user_id;
}

public int getTop_n() {
    return top_n;
}

public void setTop_n(int top_n) {
    this.top_n = top_n;
}
}