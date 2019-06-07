/*
 * Copyright 2012-2019 the original author or authors.
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *      https://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */

package io.spring.start.site.extension.svc;

import java.io.File;
import java.io.IOException;
import java.nio.file.Files;
import java.nio.file.Path;
import java.nio.file.Paths;

import io.spring.initializr.generator.project.contributor.ProjectContributor;

import org.springframework.util.FileCopyUtils;

/**
 * Contributor class to add database sql file in the project being generated.
 *
 * @author swathi udayar
 */
public class DatabaseSqlFileContributor implements ProjectContributor {

	private String projectName;

	private String uploadedDatabaseSqlFilePath;

	DatabaseSqlFileContributor(String databaseSqlFileName, String projectName) {
		this.projectName = projectName;
		this.uploadedDatabaseSqlFilePath = databaseSqlFileName;
	}

	@Override
	public void contribute(Path projectRoot) throws IOException {
		if (this.uploadedDatabaseSqlFilePath != null
				&& !this.uploadedDatabaseSqlFilePath.equals("")) {
			// Convert given filename string to a path and resolves it against projectRoot
			Path outputPath = projectRoot
					.resolve("db/deployment_sql/" + this.projectName + ".sql");
			// Create all directories by creating all nonexistent parent directories
			// first.
			Files.createDirectories(outputPath.getParent());
			// create empty file
			Files.createFile(outputPath);
			File uploadedFile = new File(this.uploadedDatabaseSqlFilePath);
			if (uploadedFile.exists() && !uploadedFile.isDirectory()) {
				Path fileStorageLocation = Paths.get(this.uploadedDatabaseSqlFilePath)
						.toAbsolutePath().normalize();
				// copy contents of uploaded database file to
				// db/deployment_sql/<project_name>.sql of project
				FileCopyUtils.copy(Files.newInputStream(fileStorageLocation),
						Files.newOutputStream(outputPath));
			}
		}
	}

}
