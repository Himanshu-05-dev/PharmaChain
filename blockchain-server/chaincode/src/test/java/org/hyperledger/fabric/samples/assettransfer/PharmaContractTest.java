package org.hyperledger.fabric.samples.assettransfer;

import org.hyperledger.fabric.contract.Context;
import org.hyperledger.fabric.shim.ChaincodeStub;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import static org.junit.jupiter.api.Assertions.assertTrue;
import static org.mockito.Mockito.*;

import java.util.HashMap;
import java.util.Map;

class PharmaContractTest {
    
    private PharmaContract contract;
    private Context ctx;
    private ChaincodeStub stub;
    private Map<String, String> mockLedger;
    
    private static final String PACK = "pack123";
    private static final String BATCH = "batch456";
    
    @BeforeEach
    void setup() {
        contract = new PharmaContract();
        ctx = mock(Context.class);
        stub = mock(ChaincodeStub.class);
        when(ctx.getStub()).thenReturn(stub);
        
        mockLedger = new HashMap<>();
        
        doAnswer(invocation -> {
            String key = invocation.getArgument(0);
            String value = invocation.getArgument(1);
            mockLedger.put(key, value);
            return null;
        }).when(stub).putStringState(anyString(), anyString());
        
        when(stub.getStringState(anyString())).thenAnswer(invocation -> {
            String key = invocation.getArgument(0);
            return mockLedger.get(key);
        });
    }

    @Test
    void writtenKeyIsReadableByGetPackStatus() {
        contract.recordTransition(ctx, PACK, "MINTED", "from", "to", "date", "time", "seller");
        String result = contract.getPackStatus(ctx, PACK, BATCH);
        assertTrue(result.contains("\"status\":\"Packaged\""));
    }

    @Test
    void soldPackDoesNotReportAtShop() {
        contract.recordTransition(ctx, PACK, "MINTED", "from1", "to1", "date", "time", "seller");
        contract.recordTransition(ctx, PACK, "INTAKE", "from2", "to2", "date", "time", "seller");
        contract.recordTransition(ctx, PACK, "SOLD",   "to2", "to3", "date", "time", "seller");
        String result = contract.getPackStatus(ctx, PACK, BATCH);
        assertTrue(result.contains("\"status\":\"Sold\""));
    }
}
