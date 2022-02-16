package fr.brgm.mapClient.vocabulary;

import io.swagger.annotations.Api;
import io.swagger.annotations.ApiOperation;
import io.swagger.annotations.ApiResponse;
import io.swagger.annotations.ApiResponses;
import lombok.AllArgsConstructor;
import org.springframework.http.MediaType;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

@RestController
@AllArgsConstructor
@RequestMapping("/vocabulary")
@Api(value = "/vocabulary", description = "API REST for getting vocabularies")
public class VocabularyController {

    VocabularyService service;

    /**
     * Return the corresponding vocabulary
     * @param name
     * @return The vocabulary content
     */
    @GetMapping(value = "/", produces = MediaType.APPLICATION_JSON_VALUE)
    @ApiOperation(value = "Return the corresponding vocabulary", httpMethod = "GET", response = String.class)
    @ApiResponses({
            @ApiResponse(code = 200, response = String.class, message = "The vocabulary content")
    })
    public String getVocabulary(@RequestParam String name) {
       return service.getVocabularyContent(name);
    }
}
