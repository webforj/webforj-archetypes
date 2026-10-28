#set( $symbol_pound = '#' )
#set( $symbol_dollar = '$' )
#set( $symbol_escape = '\' )
package ${package}.views;

import static org.junit.jupiter.api.Assertions.assertEquals;

import ${package}.Application;

import com.webforj.automation.act.UserInteraction;
import com.webforj.automation.find.ComponentLocator;
import com.webforj.component.button.Button;
import com.webforj.component.field.TextField;
import com.webforj.component.toast.Toast;
import com.webforj.testbed.WebforjTestbed;
import com.webforj.testbed.annotation.WebforjTest;
import org.junit.jupiter.api.Test;
import org.springframework.boot.test.context.SpringBootTest;
import org.springframework.test.context.ActiveProfiles;

@SpringBootTest
@ActiveProfiles("test")
@WebforjTest(app = Application.class)
class HelloWorldViewTest {

  @Test
  void shouldGreetByName(WebforjTestbed context) {
    context.navigate(HelloWorldView.class);

    UserInteraction.type(
        ComponentLocator.of(TextField.class).byLabel("What is your name?").locate(), "John Doe");
    UserInteraction.click(ComponentLocator.of(Button.class).byText("Say Hello").locate());

    Toast toast = ComponentLocator.of(Toast.class).within(context.getFrame()).locate();
    assertEquals("Welcome to webforJ Starter John Doe!", toast.getText());
  }
}
