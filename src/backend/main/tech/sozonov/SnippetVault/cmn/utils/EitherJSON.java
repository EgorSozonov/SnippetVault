package tech.sozonov.SnippetVault.cmn.utils;
import java.io.IOException;
import com.fasterxml.jackson.core.JsonGenerator;
import com.fasterxml.jackson.core.JsonProcessingException;
import com.fasterxml.jackson.databind.JsonSerializer;
import com.fasterxml.jackson.databind.SerializerProvider;

public class EitherJSON<R> extends JsonSerializer<Either<String, R>> {


public void serialize(Either<String, R> value, JsonGenerator jgen, SerializerProvider provider)
     throws IOException, JsonProcessingException {
   if (value.isLeft()) {
       jgen.writeStartObject();
       jgen.writeFieldName("isRight");
       jgen.writeBoolean(false);
       jgen.writeFieldName("errMsg");
       jgen.writeString(value.getLeft());
       jgen.writeEndObject();
   } else {
       jgen.writeStartObject();
       jgen.writeFieldName("isRight");
       jgen.writeBoolean(true);
       jgen.writeFieldName("value");
       jgen.writeObject(value.get());
       jgen.writeEndObject();
   }
}


}
