package com.keydap.sparrow.util;

import com.keydap.sparrow.SparrowClient;
import com.keydap.sparrow.auth.SparrowAuthenticator;
import com.keydap.sparrow.models.Device;
import com.keydap.sparrow.models.Group;
import com.keydap.sparrow.models.PatchableGroup;
import com.keydap.sparrow.models.User;

public class ConnectionUtil {
    private static String BASE = "http://localhost:7090";
    
    protected static String baseApiUrl = BASE + "/v2";
    
    protected static String baseOauthUrl = BASE + "/oauth2";

    private static SparrowClient client;
    
    public static void init() throws Exception {
        if(client == null) {
            SparrowAuthenticator authenticator = new SparrowAuthenticator("admin", "example.COM", "secret");
            client = new SparrowClient(baseApiUrl, baseOauthUrl, authenticator);
            client.register(User.class, Group.class, Device.class, PatchableGroup.class);
            client.authenticate();
        }
    }

    public static SparrowClient get() {
        return client;
    }
}
