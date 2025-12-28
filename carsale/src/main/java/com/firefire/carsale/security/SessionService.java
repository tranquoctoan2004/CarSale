package com.firefire.carsale.security;

import org.springframework.stereotype.Service;

import com.firefire.carsale.dto.response.AccountResponse;

import java.util.Map;
import java.util.concurrent.ConcurrentHashMap;

@Service
public class SessionService {
    private final Map<String, AccountResponse> sessions = new ConcurrentHashMap<>();
    private final Map<Integer, String> userTokens = new ConcurrentHashMap<>();

    public String createSession(AccountResponse account) {
        String token = java.util.UUID.randomUUID().toString();

        // Xóa session cũ
        if (userTokens.containsKey(account.getAccountId())) {
            String oldToken = userTokens.get(account.getAccountId());
            sessions.remove(oldToken);
        }

        sessions.put(token, account);
        userTokens.put(account.getAccountId(), token);

        return token;
    }

    public AccountResponse getSession(String token) {
        return sessions.get(token);
    }

    public void removeSession(String token) {
        AccountResponse account = sessions.get(token);
        if (account != null) {
            userTokens.remove(account.getAccountId());
        }
        sessions.remove(token);
    }

    public boolean isValidSession(String token) {
        return sessions.containsKey(token);
    }

    public AccountResponse getSessionByAccountId(Integer accountId) {
        String token = userTokens.get(accountId);
        return token != null ? sessions.get(token) : null;
    }
}
