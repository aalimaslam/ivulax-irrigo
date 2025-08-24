FROM postgres:latest

# Set environment variables
ENV POSTGRES_USER=${POSTGRES_USERNAME}
ENV POSTGRES_PASSWORD=${POSTGRES_PASSWORD}
ENV POSTGRES_DB=${POSTGRES_DB}

# Copy any initialization scripts (if needed)
# COPY ./init.sql /docker-entrypoint-initdb.d/

# Expose the PostgreSQL port
EXPOSE 5432

# The default command will start PostgreSQL
CMD ["postgres"]
