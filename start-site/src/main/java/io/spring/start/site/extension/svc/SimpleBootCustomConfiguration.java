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

import io.spring.initializr.generator.buildsystem.gradle.GradleBuild;
import io.spring.initializr.generator.condition.ConditionalOnBuildSystem;
import io.spring.initializr.generator.project.ProjectGenerationConfiguration;
import io.spring.initializr.generator.project.ResolvedProjectDescription;
import io.spring.initializr.generator.project.contributor.ProjectContributor;
import io.spring.initializr.generator.spring.build.BuildCustomizer;
import io.spring.initializr.generator.spring.build.gradle.ConditionalOnGradleVersion;
import io.spring.start.site.extension.svc.condition.ConditionalOnAddJenkinsFile;
import io.spring.start.site.extension.svc.condition.ConditionalOnAddSampleUI;
import io.spring.start.site.extension.svc.condition.ConditionalOnApplyScaffoldingScripts;

import org.springframework.context.annotation.Bean;

/**
 * Project generation configuration class to add our configuration to the context.
 *
 * @author swathi udayar
 */
@ProjectGenerationConfiguration
public class SimpleBootCustomConfiguration {

	/*
	 * Add JenkinsFileContributor bean to application context only if add jenkins file
	 * checkbox is checked in ui
	 */
	@Bean
	@ConditionalOnAddJenkinsFile("true")
	public ProjectContributor jenkinsFileContributor() {
		return new JenkinsFileContributor("classpath:svc_templates");
	}

	/*
	 * Add sampleAngularJSUIContributor bean to application context only if add angularjs
	 * client code checkbox is checked in ui
	 */
	@Bean
	@ConditionalOnAddSampleUI("true")
	public ProjectContributor sampleAngularJSUIContributor() {
		return new SampleAngularJSUIContributor(
				"classpath:svc_templates/angularjs_sample_code");
	}

	/*
	 * Add databaseSqlFileContributor bean to application context
	 */
	@Bean
	@ConditionalOnBuildSystem("gradle")
	public ProjectContributor databaseSqlFileContributor(
			ResolvedProjectDescription projectDescription) {
		return new DatabaseSqlFileContributor(projectDescription.getDatabaseSQLFile(),
				projectDescription.getName());
	}

	/*
	 * apply scaffolding plugin to project if build system is gradle
	 */
	@Bean
	@ConditionalOnBuildSystem("gradle")
	@ConditionalOnApplyScaffoldingScripts("true")
	public BuildCustomizer<GradleBuild> scaffoldingPluginGradleBuildCustomizer(
			ResolvedProjectDescription projectDescription) {
		return (build) -> {
			build.buildscript((buildscript) -> buildscript.dependency(
					"com.svc.svc_core.common_libs.gradle.custom_plugins:gradle_custom_plugins:+"));
			build.applyPlugin("svc.scaffold-app");
			build.repositories().add("svc_maven_repo");
			String dbFileName = projectDescription.getName();
			String basePackageName = projectDescription.getPackageName()
					.replace("." + projectDescription.getName(), "");
			String pvtLibName = projectDescription.getName().replace("_srv", "")
					.concat("_lib_pvt");
			String pubLibName = projectDescription.getName().replace("_srv", "")
					.concat("_lib_pub");
			build.customizeTask("scaffoldApp", (task) -> {
				task.invoke("git_repo = ", "\"../\"");
				task.invoke("working_code_relative_path = ", "\"./\"");
				task.invoke("project = ", "\"" + dbFileName + "\"");
				task.invoke("web_service = ", "\"" + projectDescription.getName() + "\"");
				task.invoke("public_library = ", "\"" + pubLibName + "\"");
				task.invoke("private_library", "\"" + pvtLibName + "\"");
				task.invoke("parent_package = ", "\"" + basePackageName + "\"");
				task.invoke("private_lib_parent_package = ",
						"\"" + basePackageName + "\"");
				task.invoke("public_lib_parent_package = ",
						"\"" + basePackageName + "\"");
			});

			build.customizeTask("compileJava",
					(task) -> task.invoke("dependsOn", "scaffold"));

			build.customizeTask("project.gradle.buildFinished", (task) -> task.invoke(
					"buildResult ->",
					"if (buildResult.getFailure() != null) {\n"
							+ "		println \"If this is your first build make sure you have added public and private lbraries as dependencies\" \n"
							+ "	}"));
		};
	}

	/*
	 * apply version management plugin to project if build system is gradle
	 */
	@Bean
	@ConditionalOnBuildSystem("gradle")
	@ConditionalOnGradleVersion("5")
	public BuildCustomizer<GradleBuild> versionMgmtPluginGradleBuildCustomizer(
			ResolvedProjectDescription projectDescription) {
		return (build) -> {
			if (projectDescription.getApplyScaffoldingScripts() == null) {
				build.buildscript((buildscript) -> buildscript.dependency(
						"com.svc.svc_core.common_libs.gradle.custom_plugins:gradle_custom_plugins:+"));
				build.repositories().add("svc_maven_repo");
			}
			build.applyPlugin("svc.version-management");

			build.customizeTask("versionManagement",
					(task) -> task.invoke("git_directory = ", "file(\"./\")"));

			build.customizeTask("build.finalizedBy",
					(task) -> task.invoke("", "gitCommitNewVersionTask"));

			build.customizeTask("compileJava.finalizedBy ",
					(task) -> task.invoke("revertVersionOnFailureTask"));

			build.customizeTask("build.finalizedBy ",
					(task) -> task.invoke("revertVersionOnFailureTask"));

		};
	}

	/*
	 * apply some more plugins if build system is gradle
	 */
	@Bean
	@ConditionalOnBuildSystem("gradle")
	@ConditionalOnGradleVersion("5")
	public ProjectContributor repositionVersionInBuildDotGradle(
			ResolvedProjectDescription projectDescription) {
		return new RepositionVersionInBuildDotGradle();
	}

	/*
	 * apply some more plugins if build system is gradle
	 */
	@Bean
	@ConditionalOnBuildSystem("gradle")
	public BuildCustomizer<GradleBuild> commonPluginGradleBuildCustomizer(
			ResolvedProjectDescription projectDescription) {
		return (build) -> build.applyPlugin("eclipse");
	}

	/*
	 * Add UpdateGradleFiles bean to application context to update pvt and public lib
	 * configuration in build.gradle
	 */
	@Bean
	@ConditionalOnBuildSystem("gradle")
	@ConditionalOnApplyScaffoldingScripts("true")
	public ProjectContributor updateGradleFiles(
			ResolvedProjectDescription projectDescription) {
		return new AddPvtAndPubLibDependency(
				projectDescription.getName().replace("_srv", "").concat("_lib_pvt"),
				projectDescription.getName().replace("_srv", "").concat("_lib_pub"));
	}

}
