package com.aurumpay.core.common;

import java.time.Instant;

public record ApiError(String code, String message, Instant timestamp) {}