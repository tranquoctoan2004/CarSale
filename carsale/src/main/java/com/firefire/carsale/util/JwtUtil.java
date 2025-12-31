package com.firefire.carsale.util;

import io.jsonwebtoken.*;
import io.jsonwebtoken.security.Keys;
import io.jsonwebtoken.security.SignatureException;

import javax.crypto.SecretKey;
import java.util.Date;

public class JwtUtil {

    // Secret key (tối thiểu 256 bit cho HS256)
    private static final String SECRET = "firefirecarsale_super_secret_key_256bit_min_length!";
    private static final SecretKey KEY = Keys.hmacShaKeyFor(SECRET.getBytes());

    // Thời gian hết hạn token (vd: 1 giờ)
    private static final long EXPIRATION_MS = 3600000;

    /**
     * Tạo token JWT cho username
     */
    public static String generateToken(String username) {
        Date now = new Date();
        Date expiryDate = new Date(now.getTime() + EXPIRATION_MS);

        return Jwts.builder()
                .setSubject(username)
                .setIssuedAt(now)
                .setExpiration(expiryDate)
                .signWith(KEY, SignatureAlgorithm.HS256)
                .compact();
    }

    /**
     * Lấy username từ token
     */
    public static String getUsernameFromToken(String token) throws JwtException {
        Jws<Claims> claimsJws = Jwts.parserBuilder()
                .setSigningKey(KEY)
                .build()
                .parseClaimsJws(token);

        return claimsJws.getBody().getSubject();
    }

    /**
     * Kiểm tra token hợp lệ
     */
    public static boolean validateToken(String token) {
        try {
            Jwts.parserBuilder()
                    .setSigningKey(KEY)
                    .build()
                    .parseClaimsJws(token);
            return true;
        } catch (ExpiredJwtException ex) {
            System.out.println("JWT expired: " + ex.getMessage());
        } catch (MalformedJwtException ex) {
            System.out.println("JWT malformed: " + ex.getMessage());
        } catch (UnsupportedJwtException ex) {
            System.out.println("JWT unsupported: " + ex.getMessage());
        } catch (SignatureException ex) {
            System.out.println("JWT signature invalid: " + ex.getMessage());
        } catch (IllegalArgumentException ex) {
            System.out.println("JWT claims string empty: " + ex.getMessage());
        }
        return false;
    }
}
