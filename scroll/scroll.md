# Scroll Documentation

Scroll is a fast and lightweight C++ library for console and file logging. [View repository](https://github.com/atalantestudio/scroll)

Below is a code example that writes one log of each level to the console.

```cpp
void writeLogs() {
    std::ofstream stream("path/to/file.log");

    FileLogger logger(stream, LogLevel::ALL, "SOURCE");

    logger.trace(__FILE__, __LINE__, "Testing [] [] []...", 1, 2, 3);
    logger.debug("Testing [] [] []...", 1, 2, 3);
    logger.info("Testing [] [] []...", 1, 2, 3);
    logger.warning("Testing [] [] []...", 1, 2, 3);
    logger.error(__func__, __FILE__, __LINE__, "Testing [] [] []...", 1, 2, 3);
}
```

## Log

A log is a message carrying information about an application's runtime status, intended for the application developer.

Logs usually contain a timestamp, a log level and a text message.

### Levels

Each log is associated with a log level, i.e. a way to represent the severity of the log.  
Scroll defines 5 log levels and 2 aliases in the [LogLevel](#) enum.

| Level | Stream | Description |
| -- | -- | -- |
| `ALL` | | Enable all logs (alias for `TRACE`). |
| `TRACE` | [`std::cerr`](https://en.cppreference.com/w/cpp/io/cerr.html) | Enable logs with a level greater than or equal to `TRACE`. |
| `DEBUG` | [`std::cerr`](https://en.cppreference.com/w/cpp/io/cerr.html) | Enable logs with a level greater than or equal to `DEBUG`. |
| `INFO` | [`std::cout`](https://en.cppreference.com/w/cpp/io/cout.html) | Enable logs with a level greater than or equal to `INFO`. |
| `WARNING` | [`std::cerr`](https://en.cppreference.com/w/cpp/io/cerr.html) | Enable logs with a level greater than or equal to `WARNING`. This level is intended for logs that describe an anomaly but do not cause an application failure. |
| `ERROR` | [`std::cerr`](https://en.cppreference.com/w/cpp/io/cerr.html) | Enable logs with a level greater than or equal to `ERROR`. |
| `NONE` | | Disable all logs (alias for `ERROR`). |

> [!WARNING]
> A logger will ignore any attempt to write a log with a level below the configured minimum level.

### Sources

Scroll allows developers to associate a source to a [Logger](#Logger) object.
The source is a fast way of checking a log's origin without reading the full message.

The source is located between the timestamp and the log level.

### Argument injection pattern

This pattern is used to detect where to insert formatted arguments into a string.

By default, the argument injection pattern is `[]`. It can be replaced using [setArgumentInjectionPattern](#Logger-setArgumentInjectionPattern), but it cannot be changed on a per-logger basis.

> [!ERROR]
> Note that the argument injection pattern isn't owned by the library, and its memory must instead be managed by the user.

***

## Logger

The base from which [ConsoleLogger](#ConsoleLogger) and [FileLogger](#FileLogger) extend. It is not constructible, but it can be extended by the user to write a new logger implementation.

### getMinLogLevel

Returns a [LogLevel](#LogLevel) representing the minimum log level used by this logger.

### getSource

Returns the source string used by this logger.

> [!INFO]
> The source isn't owned by the Logger class. This function returns a pointer to a block of memory managed by the user.

***

## ConsoleLogger

An extension of [Logger](#Logger) that writes logs to a console output stream.

1. For the argument type `Argument`, the overload `Logger& operator<<(Logger&, const Argument&)` **must** be defined.
2. For each argument type `Argument`, the overload `Logger& operator<<(Logger&, const Argument&)` **must** be defined.

```cpp
void writeLogs() {
    std::ofstream stream("path/to/file.log");

    FileLogger logger(stream, LogLevel::ALL, "SOURCE");

    logger.trace(__FILE__, __LINE__, "Testing [] [] []...", 1, 2, 3);
    logger.debug("Testing [] [] []...", 1, 2, 3);
    logger.info("Testing [] [] []...", 1, 2, 3);
    logger.warning("Testing [] [] []...", 1, 2, 3);
    logger.error(__func__, __FILE__, __LINE__, "Testing [] [] []...", 1, 2, 3);
}
```

Examples:

```log:console
[12:34:56.789]  TRACE  Lorem ipsum dolor sit amet, consectetur adipiscing elit.
                       at path/to/file:1
[12:34:56.789]  DEBUG  Lorem ipsum dolor sit amet, consectetur adipiscing elit.
[12:34:56.789]  INFO  Lorem ipsum dolor sit amet, consectetur adipiscing elit.
[12:34:56.789]  WARNING  Lorem ipsum dolor sit amet, consectetur adipiscing elit.
[12:34:56.789]  ERROR  Lorem ipsum dolor sit amet, consectetur adipiscing elit.
                       at main (path/to/file:1)
```

## FileLogger

An extension of [Logger](#Logger) that writes logs to a file.

> [!NOTE]
> 
> `stream` **must** already be open.

1. For the argument type `Argument`, the overload `Logger& operator<<(Logger&, const Argument&)` **must** be defined.
2. For each argument type `Argument`, the overload `Logger& operator<<(Logger&, const Argument&)` **must** be defined.

Example:

```log
[12:34:56.789] TRACE Lorem ipsum dolor sit amet, consectetur adipiscing elit.
                     at path/to/file:1
[12:34:56.789] DEBUG Lorem ipsum dolor sit amet, consectetur adipiscing elit.
[12:34:56.789] INFO Lorem ipsum dolor sit amet, consectetur adipiscing elit.
[12:34:56.789] WARNING Lorem ipsum dolor sit amet, consectetur adipiscing elit.
[12:34:56.789] ERROR Lorem ipsum dolor sit amet, consectetur adipiscing elit.
                     at main (path/to/file:1)
```

***

<!-- ConsoleLogger-trace -->

Writes a trace log to the console output stream. See [format](#Logger-format) for the argument formatting.

`file` and `line` appear in a stack trace inserted after the log message.