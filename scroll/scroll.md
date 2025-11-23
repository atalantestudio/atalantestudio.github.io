# Scroll Documentation

[View GitHub repository](https://github.com/atalantestudio/scroll)

Scroll is a fast and lightweight C++ library that supports [console](#ConsoleLogger) and [file](#FileLogger) logging. It is licensed under [MIT](https://github.com/atalantestudio/scroll/tree/main/LICENSE).

Below is a minimal example that writes one log of each level to the console.

```cpp
#include <scroll/scroll.hpp>

int main() {
	scroll::ConsoleLogger logger(std::cout, scroll::LogLevel::ALL, "EXAMPLE");

	logger.trace(__FILE__, __LINE__, "This is a trace log: [] []", "hello", 1);
	logger.debug("This log doesn't contain any formatted arguments.");
	logger.info("The \"[]\" log level provides useful information to the application developer.", "INFO");
	logger.warning("This issue is notable, but not critical.");
	logger.error(__func__, __FILE__, __LINE__, "Most important log level.\nIt is usually sent before application crashes or other similar emergencies.");

	return 0;
}
```

This produces the output below:

```log:console
[15:37:46.216459] EXAMPLE  TRACE  This is a trace log: hello 1 (at path/to/file:6)
[15:37:46.216459] EXAMPLE  DEBUG  This log doesn't contain any formatted arguments.
[15:37:46.216459] EXAMPLE  INFO  The "INFO" log level provides useful information to the application developer.
[15:37:46.216459] EXAMPLE  WARNING  This issue is notable, but not critical.
[15:37:46.216459] EXAMPLE  ERROR  Most important log level.
                                  It is usually sent before application crashes or other similar emergencies. (in main, at path/to/file:10)
```

The file logging API only differs in the way the logger is constructed.

## Installing

When inside your project directory, run

```sh
git clone git@github.com:atalantestudio/scroll --recurse-submodules
```

This will install the latest version of Scroll. It will also initialize the [ModuleBase](https://github.com/atalantestudio/ModuleBase) submodule, which serves as the foundation for all Atalante modules.

Include [scroll/scroll.hpp](https://github.com/atalantestudio/scroll/tree/main/scroll/scroll.hpp). You will then be able to access the library's definitions under the `scroll` namespace.

Scroll uses the following custom types for string handling:

- [`scroll::sequence<char8>`](https://github.com/atalantestudio/ModuleBase/blob/9133e933321726778890ef16b83eda7e00021f7f/Base/Types/sequence.hpp#L22) is a sequence of 8-bit characters allocated on the heap. Unlike [`std::string`](https://en.cppreference.com/w/cpp/string/basic_string.html), it is not resizeable.
  A sequence can be constructed from a C-style string or C++ string, and can also be converted to a C++ string via a [conversion operator](https://github.com/atalantestudio/ModuleBase/blob/9133e933321726778890ef16b83eda7e00021f7f/Base/Types/sequence.hpp#L55).  
  Sequences should be passed by reference to avoid unnecessary copies.
- [`scroll::view<char8>`](https://github.com/atalantestudio/ModuleBase/blob/9133e933321726778890ef16b83eda7e00021f7f/Base/Types/view.hpp#L16) is a non-owning view of a sequence of characters, like [`std::string_view`](https://en.cppreference.com/w/cpp/string/basic_string_view.html).  
  Views should be passed by value.

> [!INFO] For brevity, the `scroll` namespace is not included in the overload signatures.

## Log

A log is a message carrying information about an application's runtime status, intended for the application developer. Logs usually contain a timestamp, a log level and a text message.

Logs are outputted to the [`std::clog`](https://en.cppreference.com/w/cpp/io/clog.html) output stream.

### Level

Each log is associated with a log level, i.e. a way to represent the severity of the log.  
Scroll defines 5 log levels and 2 aliases in the [LogLevel](https://github.com/atalantestudio/scroll/blob/4b1eb1b3615bba218a846a827c3de1c2b175a24e/scroll/LogLevel.hpp#L12) enum.

| Level | Description |
| -- | -- |
| `ALL` | Enable all logs (alias for `TRACE`). |
| `TRACE` | Enable logs with a level greater than or equal to `TRACE`. |
| `DEBUG` | Enable logs with a level greater than or equal to `DEBUG`. |
| `INFO` | Enable logs with a level greater than or equal to `INFO`. |
| `WARNING` | Enable logs with a level greater than or equal to `WARNING`. This level is intended for logs that describe an anomaly but do not cause an application failure. |
| `ERROR` | Enable logs with a level greater than or equal to `ERROR`. |
| `NONE` | Disable all logs (alias for `ERROR`). |

> [!WARNING] A logger will ignore any attempt to write a log with a level below the configured minimum level.

### Source

A [Logger](#Logger) can be configured with a *source string*, which is a fast way of checking a log's origin without reading the full message.

The source is located between the timestamp and the log level.

> [!INFO] The source isn't owned by the library and must instead be managed by the user.

### Argument injection pattern

This pattern is used to detect where to insert formatted arguments into a string.

By default, the argument injection pattern is `[]`. It can be replaced using [setArgumentInjectionPattern](#Logger-setArgumentInjectionPattern), but it cannot be changed on a per-logger basis.

> [!INFO] The argument injection pattern isn't owned by the library and must instead be managed by the user.



***



### operator<<

Formats the provided argument into `stream`. Returns the updated stream.

<!-- operator<< -->

### toString

Converts and returns `argument` to a [`std::string`](https://en.cppreference.com/w/cpp/string/basic_string.html).

<!-- toString -->



***



## Logger

The base from which [ConsoleLogger](#ConsoleLogger) and [FileLogger](#FileLogger) extend. It is not constructible, but it can be extended by the user to write a new logger implementation.

### Logger-getArgumentInjectionPattern

Returns the current [argument injection pattern](#Argument%20injection%20pattern).

> [!INFO] This function returns a pointer to a block of memory managed by the user.

<!-- Logger-getArgumentInjectionPattern -->

### Logger-setArgumentInjectionPattern

Sets `pattern` as the current [argument injection pattern](#Argument%20injection%20pattern). This operation affects all Logger objects.

<!-- Logger-setArgumentInjectionPattern -->

### Logger-format

Returns a string containing the formatted argument(s).

<!-- Logger-format -->

### Logger-timestamp

Returns a formatted string representing the current timestamp, with microsecond precision. The timestamp follows the format `%H:%M:%S.%U`, where
- `%H` is the 24 hour clock (00-23)
- `%M` is the minute (00-59)
- `%S` is the second (00-59)
- `%U` is the microsecond (000000-999999)

<!-- Logger-timestamp -->

### Logger-getMinLogLevel

Returns a [LogLevel](#Level) representing the minimum log level configured for this logger.

<!-- Logger-getMinLogLevel -->

### Logger-getSource

Returns the [source](#Source) string used by this logger.

> [!INFO] This function returns a pointer to a block of memory managed by the user.

<!-- Logger-getSource -->



***



## ConsoleLogger

An extension of [Logger](#Logger) that writes text and logs to a console output stream.

### ConsoleLogger-ConsoleLogger

Constructs a new ConsoleLogger.

<!-- ConsoleLogger-ConsoleLogger -->

### ConsoleLogger-~ConsoleLogger

Destroys a ConsoleLogger object. This ends the current [SGR control sequence](https://en.wikipedia.org/wiki/ANSI_escape_code#Select_Graphic_Rendition_parameters), if there is one.

<!-- ConsoleLogger-~ConsoleLogger -->

### ConsoleLogger-getOutputStream

Returns the current output stream used for text writing.

<!-- ConsoleLogger-getOutputStream -->

### ConsoleLogger-setOutputStream

Sets `stream` as the current output stream for text writing.

> [!INFO] Note that each log level has a predefined stream and will **not** use the current output stream.

<!-- ConsoleLogger-setOutputStream -->

### ConsoleLogger-operator<<

Writes `argument` to the current output stream.

Returns a reference to the logger.

<!-- ConsoleLogger-operator<< -->

### ConsoleLogger-padLeft

Sets `padding` as the [width parameter](https://en.cppreference.com/w/cpp/io/manip/setw.html) of the current output stream and sets the [fill character positioning](https://en.cppreference.com/w/cpp/io/manip/left.html) to the left.

Returns a reference to the logger.

<!-- ConsoleLogger-padLeft -->

### ConsoleLogger-padRight

Sets `padding` as the [width parameter](https://en.cppreference.com/w/cpp/io/manip/setw.html) of the current output stream and sets the [fill character positioning](https://en.cppreference.com/w/cpp/io/manip/left.html) to the right.

Returns a reference to the logger.

<!-- ConsoleLogger-padRight -->

### ConsoleLogger-trace

Writes a trace log to the console output stream. `file` and `line` appear in a stack trace inserted after the log message.

See also [format](#Logger-format).

<!-- ConsoleLogger-trace -->

### ConsoleLogger-debug

Writes a debug log to the console output stream.

See also [format](#Logger-format).

<!-- ConsoleLogger-debug -->

### ConsoleLogger-info

Writes an information log to the console output stream.

See also [format](#Logger-format).

<!-- ConsoleLogger-info -->

### ConsoleLogger-warning

Writes a warning log to the console output stream.

See also [format](#Logger-format).

<!-- ConsoleLogger-warning -->

### ConsoleLogger-error

Writes an error log to the console output stream. `function`, `file` and `line` appear in a stack trace inserted after the log message.

See also [format](#Logger-format).

<!-- ConsoleLogger-error -->



***



## FileLogger

An extension of [Logger](#Logger) that writes logs to a file output stream.

### FileLogger-FileLogger

Constructs a new FileLogger.

> [!ERROR] `stream` **must** be in the open state.

<!-- FileLogger-FileLogger -->

### FileLogger-trace

Writes a trace log to the file output stream. `file` and `line` appear in a stack trace inserted after the log message.

See also [format](#Logger-format).

<!-- FileLogger-trace -->

### FileLogger-debug

Writes a debug log to the file output stream.

See also [format](#Logger-format).

<!-- FileLogger-debug -->

### FileLogger-info

Writes an information log to the file output stream.

See also [format](#Logger-format).

<!-- FileLogger-info -->

### FileLogger-warning

Writes a warning log to the file output stream.

See also [format](#Logger-format).

<!-- FileLogger-warning -->

### FileLogger-error

Writes an error log to the file output stream. `function`, `file` and `line` appear in a stack trace inserted after the log message.

See also [format](#Logger-format).

<!-- FileLogger-error -->



***



## TextBuffer

A class that represents a character buffer of size 4096.

### TextBuffer-getText

Returns the portion of the underlying buffer that has been written to.

<!-- TextBuffer-getText -->

### TextBuffer-jump

Advances the write offset by `offset`.

[!WARNING] The updated offset must be less than 4096.

<!-- TextBuffer-jump -->

### TextBuffer-seek

Sets the write offset by `offset`.

[!WARNING] `offset` must be less than 4096.

<!-- TextBuffer-seek -->

### TextBuffer-operator<<

Formats and writes `argument` to the underlying buffer.

Returns a reference to the text buffer.

<!-- TextBuffer-operator<< -->

### TextBuffer-padLeft

Advances the write offset by `padding` minus the size of `text` (clamped to 0), then writes `text` to the underlying buffer.

Returns a reference to the text buffer.

<!-- TextBuffer-padLeft -->

### TextBuffer-padRight

Writes `text` to the underlying buffer, then advances the write offset by `padding` minus the size of `text` (clamped to 0).

Returns a reference to the text buffer.

<!-- TextBuffer-padRight -->

### TextBuffer-flush

Writes the portion of the underlying buffer that has been written to to `stream`, then clears the buffer.

<!-- TextBuffer-flush -->

### TextBuffer-clear

Sets the write offset to 0.

<!-- TextBuffer-clear -->